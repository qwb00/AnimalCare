import React, { createContext, useState, useCallback } from "react";
import API_BASE_URL from "../config";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [reservationHistory, setReservationHistory] = useState([]);
  const [suggestedAnimals, setSuggestedAnimals] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);

  const updateSuggestedAnimals = useCallback(async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userID");

      let newSuggestedAnimals = [];

      if (!authToken || !userId) {
        console.warn(
          "User is not authenticated. Falling back to random suggestions."
        );
        const response = await axios.get(`${API_BASE_URL}/animals`);
        const animals = response.data;

        // Генерация случайных животных
        const randomIndexes = new Set();
        while (randomIndexes.size < 3 && randomIndexes.size < animals.length) {
          const randomIndex = Math.floor(Math.random() * animals.length);
          randomIndexes.add(randomIndex);
        }

        newSuggestedAnimals = Array.from(randomIndexes).map(
          (index) => animals[index]
        );
      } else {
        const reservationsResponse = await axios.get(
          `${API_BASE_URL}/reservations/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const reservations = reservationsResponse.data;

        const reservationCount = reservations.reduce((acc, reservation) => {
          if (reservation.status !== 4) {
            acc[reservation.animalId] = (acc[reservation.animalId] || 0) + 1;
          }
          return acc;
        }, {});

        const animalsResponse = await axios.get(`${API_BASE_URL}/animals`);
        const animals = animalsResponse.data;

        const sortedAnimalIds = Object.entries(reservationCount)
          .sort((a, b) => b[1] - a[1])
          .map(([animalId]) => animalId);

        const sortedAnimals = sortedAnimalIds
          .map((id) => animals.find((animal) => animal.id === id))
          .filter(Boolean);

        while (sortedAnimals.length < 3) {
          const randomAnimal =
            animals[Math.floor(Math.random() * animals.length)];
          if (!sortedAnimals.includes(randomAnimal)) {
            sortedAnimals.push(randomAnimal);
          }
        }

        newSuggestedAnimals = sortedAnimals.slice(0, 3);
      }

      // Обновляем состояние только при изменении
      if (
        JSON.stringify(newSuggestedAnimals) !== JSON.stringify(suggestedAnimals)
      ) {
        setSuggestedAnimals(newSuggestedAnimals);
      }
    } catch (error) {
      console.error("Error updating suggested animals:", error);
    }
  }, []); // suggestedAnimals — зависимость

  return (
    <AppContext.Provider
      value={{
        reservationHistory,
        setReservationHistory,
        suggestedAnimals,
        updateSuggestedAnimals, // Мемоизированная функция
        selectedAnimalId,        // Добавляем в value контекста
        setSelectedAnimalId,  
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
