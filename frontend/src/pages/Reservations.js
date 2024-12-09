import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import Calendar from "../components/Calendar";
import Footer from "../components/Footer";
import axios from "axios";
import API_BASE_URL from "../config";

function Reservations() {
  const [selectedAnimalId, setSelectedAnimalId] = useState([]);
  const [availableAnimals, setAvailableAnimals] = useState([]);

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`);
        const animalData = response.data.map((animal) => ({
          name: animal.name,
          id: animal.id,
        }));
        console.log("Available animals from API:", animalData);
        setAvailableAnimals(animalData);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    loadAnimals();
  }, []);

  const handleSearchResult = (animalId) => {
    console.log("Search result:", animalId);
    const foundAnimal = availableAnimals.find(
      (animal) => animal.id === animalId
    );

    if (foundAnimal) {
      console.log("Animal found:", foundAnimal);
      setSelectedAnimalId((prevSelectedIds) => [...prevSelectedIds, animalId]);
    } else {
      console.log("Animal not found in available animals list.");
      setSelectedAnimalId([]);
    }
  };

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
            onSearch={handleSearchResult} // Pass the search result handler
          />
        </div>

        {selectedAnimalId.length > 0 ? (
          <div className="mt-2 w-full">
            <Calendar selectedAnimalId={selectedAnimalId} />
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
