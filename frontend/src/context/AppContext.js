import React, { createContext, useState } from "react";
import API_BASE_URL from "../config";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [reservationHistory, setReservationHistory] = useState([]);
  const [suggestedAnimals, setSuggestedAnimals] = useState([]);

  const updateSuggestedAnimals = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userID");

      if (!authToken || !userId) {
        console.warn(
          "User is not authenticated. Falling back to random suggestions."
        );
        // Получаем всех животных для случайного выбора
        const response = await axios.get(`${API_BASE_URL}/animals`);
        const animals = response.data;
        const randomAnimals = animals
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setSuggestedAnimals(randomAnimals);
        return;
      }

      // Получаем данные о резервациях пользователя
      const reservationsResponse = await axios.get(
        `${API_BASE_URL}/reservations/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const reservations = reservationsResponse.data;

      // Считаем частоту резерваций (исключаем отмененные)
      const reservationCount = reservations.reduce((acc, reservation) => {
        if (reservation.status !== 4) {
          acc[reservation.animalId] = (acc[reservation.animalId] || 0) + 1;
        }
        return acc;
      }, {});

      // Получаем всех животных
      const animalsResponse = await axios.get(`${API_BASE_URL}/animals`);
      const animals = animalsResponse.data;

      // Сортируем животных по популярности
      const sortedAnimalIds = Object.entries(reservationCount)
        .sort((a, b) => b[1] - a[1])
        .map(([animalId]) => animalId);

      const sortedAnimals = sortedAnimalIds
        .map((id) => animals.find((animal) => animal.id === id))
        .filter(Boolean);

      // Если у пользователя меньше 3-х животных, добавляем случайных
      while (sortedAnimals.length < 3) {
        const randomAnimal =
          animals[Math.floor(Math.random() * animals.length)];
        if (!sortedAnimals.includes(randomAnimal)) {
          sortedAnimals.push(randomAnimal);
        }
      }

      setSuggestedAnimals(sortedAnimals.slice(0, 3));
    } catch (error) {
      console.error("Error updating suggested animals:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        reservationHistory,
        setReservationHistory,
        suggestedAnimals,
        updateSuggestedAnimals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
