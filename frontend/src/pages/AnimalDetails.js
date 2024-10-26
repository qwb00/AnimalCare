import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import AnimalCard from '../components/AnimalCard'; // Импорт компонента AnimalCard для отображения животных

function AnimalDetails() {
  const { id } = useParams(); // Получаем ID из URL
  const [animalData, setAnimalData] = useState(null);
  const [otherAnimals, setOtherAnimals] = useState([]); // Храним 3 случайных животных
  const [isLoading, setIsLoading] = useState(true);

  // Функция для получения данных о животном
  const fetchAnimalDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals/${id}`);
      setAnimalData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching animal details:', error);
      setIsLoading(false);
    }
  };

  // Функция для получения 3 случайных животных
  const fetchOtherAnimals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals`);
      const allAnimals = response.data.filter((animal) => animal.id !== id);
      
      // Выбираем 3 случайных животных
      const randomAnimals = allAnimals
        .sort(() => 0.5 - Math.random()) // Перемешиваем массив
        .slice(0, 3); // Берем первые 3 элемента

      setOtherAnimals(randomAnimals);
    } catch (error) {
      console.error('Error fetching other animals:', error);
    }
  };

  useEffect(() => {
    fetchAnimalDetails();
    fetchOtherAnimals();
  }, [id]);

  // Функции для отображения информации о животном
  const getAnimalSize = (size) => {
    switch (size) {
      case 0: return 'Small';
      case 1: return 'Medium';
      case 2: return 'Large';
      default: return 'Unknown';
    }
  };

  const getAnimalSex = (sex) => {
    return sex === 0 ? 'Male' : 'Female';
  };

  const getHealthCondition = (health) => {
    switch (health) {
      case 0: return 'Healthy';
      case 1: return 'Minor Issues';
      case 2: return 'Serious Issues';
      default: return 'Unknown';
    }
  };

  const getSpecies = (species) => {
    return species === 0 ? 'Dog' : 'Cat';
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!animalData) {
    return <div className="text-center mt-10">Animal data not available.</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <Header />

      <div className="container mx-auto text-center mt-10">
        <h1 className="text-4xl font-black mb-8">OUR ANIMALS</h1>
      </div>

      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Левая колонка с изображением животного и основной информацией */}
          <div className="w-full md:w-1/2 flex justify-center items-start">
            <img 
              src={animalData.photo} 
              alt={animalData.name} 
              className="w-full max-w-md h-[350px] object-cover rounded-xl border-2 border-black shadow-lg" 
            />
          </div>

          {/* Правая колонка с основной информацией */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">{animalData.name}</h2>
            <div className="flex flex-col gap-2 mb-4">
              <p><strong>Species:</strong> {getSpecies(animalData.species)}</p>
              <p><strong>Breed:</strong> {animalData.breed}</p>
              <p><strong>Age:</strong> {animalData.age} years</p>
              <p><strong>Sex:</strong> {getAnimalSex(animalData.sex)}</p>
              <p><strong>Size:</strong> {getAnimalSize(animalData.size)}</p>
              <p><strong>Weight:</strong> {animalData.weight}</p>
              <p><strong>Health conditions:</strong> {getHealthCondition(animalData.health)}</p>
              <p><strong>Personality:</strong> {animalData.personality}</p>
            </div>
            <div className="mt-4">
              <Link to="/reservations"> 
                <Button text={`WALK WITH ${animalData.name.toUpperCase()}`} variant="blue" icon="/icons/walk_with_animal.png" iconPosition="right" />
              </Link>
            </div>
          </div>
        </div>

        {/* Секция с историей и дополнительной информацией */}
        <div className="mt-12">
          <h3 className="text-4xl text-center font-black mb-4">STORY & DETAILED INFORMATION</h3>
          
          {/* История */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold">History</h4>
            <p>{animalData.history}</p>
          </div>

          {/* Медицинские данные */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold">Health and medical data</h4>
            <ul className="list-disc list-inside">
              <li><strong>Last medical examination:</strong> {animalData.lastExamination ? new Date(animalData.lastExamination).toLocaleDateString() : 'N/A'}</li>
              <li><strong>Vaccinations:</strong> {animalData.isVaccinated ? 'All necessary vaccinations have been completed' : 'Not vaccinated'}</li>
              <li><strong>Sterilized:</strong> {animalData.isSterilized ? 'Yes' : 'No'}</li>
              <li><strong>Micro-chipped:</strong> {animalData.isChipped ? 'Yes' : 'No'}</li>
            </ul>
          </div>

          {/* Поведение и обучение */}
          <div>
            <h4 className="text-xl font-semibold">Behavior and training</h4>
            <ul className="list-disc list-inside">
              <li><strong>Compatibility with people:</strong> {animalData.isPeopleFriendly ? 'Gets along well with people (especially with kids)' : 'Not recommended with kids'}</li>
              <li><strong>Compatibility with other animals:</strong> {animalData.isAnimalFriendly ? 'Gets along great with other animals' : 'Prefers to be the only animal'}</li>
              <li><strong>Knows basic commands:</strong> {animalData.isCommandsTaught ? 'Yes' : 'No'}</li>
              <li><strong>Leash trained:</strong> {animalData.isLeashTrained ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>

        {/* Секция с другими животными */}
        <div className="mt-12">
          <h3 className="text-4xl text-center font-black mb-8">OTHER ANIMALS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherAnimals.map((animal) => (
            <AnimalCard
              key={animal.id} // Используем уникальный идентификатор
              id={animal.id}
              image={animal.photo} // Используем правильный ключ photo
              name={animal.name}
              age={`${animal.age} years`}
              breed={animal.breed}
            />
          ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AnimalDetails;
