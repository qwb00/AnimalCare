import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import Calendar from '../components/Calendar';
import Footer from '../components/Footer';
import axios from 'axios';
import API_BASE_URL from '../config';

function Reservations() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [availableAnimals, setAvailableAnimals] = useState([]);

  // Загружаем список животных с API при загрузке компонента
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`);
        const animalNames = response.data.map((animal) => animal.name);
        console.log('Available animals from API:', animalNames); // Лог доступных животных
        setAvailableAnimals(animalNames);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };

    loadAnimals();
  }, []);

  const handleSearchResult = (animalName) => {
    console.log('Search result:', animalName); // Лог выбранного имени
    if (availableAnimals.includes(animalName)) {
      console.log('Animal found:', animalName);
      setSelectedAnimal(animalName);
    } else {
      console.log('Animal not found in available Animals array.');
      setSelectedAnimal(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header />

      <div className="flex flex-col items-start justify-center mt-16 w-full max-w-[1024px] mx-auto px-0">
        <h1 className="text-4xl font-black text-center mb-8 w-full">WALKING SCHEDULE</h1>

        <div className="flex items-center justify-start w-full mb-6">
          <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
          <img src="/icons/calendar_black.png" alt="Calendar icon" className="h-6 w-6 ml-2" />
        </div>

        <div className="flex items-start justify-start w-full mb-8">
          <Search
            placeholder="Animal's name"
            icon="/icons/pen.png"
            onSearch={handleSearchResult}
          />
        </div>

        {selectedAnimal ? (
          <div className="mt-2 w-full">
            <Calendar selectedAnimal={selectedAnimal} />
          </div>
        ) : (
          <p className="text-xl text-gray-600 mt-4">
            Please select an animal to see the schedule or make sure the name matches the available animals.
          </p>
        )}
      </div>

      <h2 className="text-4xl font-black text-center my-8">THANK YOU FOR YOUR TIME!</h2>
      <Footer />
    </div>
  );
}

export default Reservations;
