import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AnimalCard from '../components/AnimalCard';
import axios from 'axios';

function Animals() {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Функция загрузки всех животных
  const loadAnimals = async () => {
    setIsLoading(true);

    try {
      // Используем полный URL без прокси
      const response = await axios.get('https://animalcaredb-3c73ac350ab8.herokuapp.com/api/animals');
      
      // Лог данных для отладки
      console.log('Fetched animals:', response.data);

      // Сохранение полученных данных в состоянии
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setIsLoading(false);
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
