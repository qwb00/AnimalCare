import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AnimalCard from '../components/AnimalCard';
import axios from 'axios';
import API_BASE_URL from '../config'; // Импортируем базовый URL

function Animals() {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Функция загрузки всех животных
  const loadAnimals = async () => {
    try {
      // Отправка CORS-запроса с использованием axios
      const response = await axios.get('https://animalcaredb-3c73ac350ab8.herokuapp.com/api/animals', {
        headers: {
          'Accept': 'application/json',
        },
      });
  
      console.log('Fetched animals:', response.data);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };
  
  useEffect(() => {
    loadAnimals();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto">
      <Header />

      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-black mt-8 mb-12">OUR ANIMALS</h1>
      </div>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {animals.map((animal, index) => (
            <AnimalCard
              key={index}
              image={animal.photo} // Используем правильный ключ photo
              name={animal.name}
              age={`${animal.age} years`}
              breed={animal.breed}
            />
          ))}
        </div>

        {isLoading && (
          <div className="text-center mt-4">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Animals;
