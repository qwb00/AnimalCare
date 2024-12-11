import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import Calendar from "../components/Calendar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function Reservations() {
  const { selectedAnimalId, setSelectedAnimalId } = useContext(AppContext);
  const [availableAnimals, setAvailableAnimals] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`);
        const animalData = response.data.map((animal) => ({
          name: animal.name,
          id: animal.id,
        }));
        setAvailableAnimals(animalData);

        // Проверим, есть ли в URL параметр animalName
        const params = new URLSearchParams(location.search);
        const animalName = params.get("animalName");
        if (animalName) {
          // Найдём животное по имени сразу
          const foundAnimal = animalData.find(
            (animal) => animal.name.toLowerCase() === animalName.toLowerCase()
          );
          if (foundAnimal) {
            setSelectedAnimalId(foundAnimal.id);
          }
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    loadAnimals();
  }, [location.search]);

  const handleSearchResult = (animalId) => {
    const foundAnimal = availableAnimals.find(
      (animal) => animal.id === animalId
    );
    if (foundAnimal) {
      setSelectedAnimalId(animalId);
    } else {
      setSelectedAnimalId(null);
    }
  };

  // Получаем animalName из query-параметров, чтобы передать в Search
  const params = new URLSearchParams(location.search);
  const initialAnimalName = params.get("animalName") || "";

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header />

      <div className="flex flex-col items-start justify-center mt-16 w-full max-w-[1024px] mx-auto px-0">
        <h1 className="text-4xl font-black text-center mb-8 w-full">
          WALKING SCHEDULE
        </h1>

        <div className="flex items-center justify-start w-full mb-6">
          <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
          <img
            src="/icons/calendar_black.png"
            alt="Calendar icon"
            className="h-6 w-6 ml-2"
          />
        </div>

        <div className="flex items-start justify-start w-full mb-8">
          <Search
            placeholder="Animal's name"
            icon="/icons/pen.png"
            onSearch={handleSearchResult}
            initialAnimalName={initialAnimalName} // Передаем имя животного из параметра
          />
        </div>

        {selectedAnimalId ? (
          <div className="mt-2 w-full">
            <Calendar />
          </div>
        ) : (
          <p className="text-xl text-gray-600 mt-4">
            Please select an animal to see the schedule or make sure the name
            matches the available animals.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Reservations;
