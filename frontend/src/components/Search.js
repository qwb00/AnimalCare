import React, { useState, useEffect, useRef } from 'react';
import Button from './Button'; // Импортируем компонент Button
import axios from 'axios';
import API_BASE_URL from '../config';

// Компонент для поиска животного
function Search({ placeholder, icon, onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Управляет состоянием выпадающего меню
  const [animals, setAnimals] = useState([]); // Хранит список животных из API
  const [isInputError, setIsInputError] = useState(false); // Управляет состоянием ошибки ввода
  const dropdownRef = useRef(null); // Ссылка на выпадающее меню для отслеживания кликов вне его

  // Загрузка списка животных из API
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`);
        const animalNames = response.data.map((animal) => animal.name);
        setAnimals(animalNames); // Устанавливаем имена животных
        console.log('Loaded animals from API:', animalNames);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };

    loadAnimals();
  }, []);

  // Функция для поиска животного
  const handleSearch = () => {
    if (!searchValue) {
      setIsInputError(true); // Установить ошибку, если поле пустое
      return;
    }

    if (animals.includes(searchValue)) {
      setIsInputError(false);
      onSearch(searchValue); // Передаем имя животного напрямую
    } else {
      setIsInputError(true);
    }

    setIsDropdownOpen(false); // Закрыть выпадающее меню при нажатии на кнопку Search
  };

  // Функция для выбора животного из выпадающего меню
  const handleSelectAnimal = (animal) => {
    setSearchValue(animal);
    setIsDropdownOpen(false); // Закрыть меню при выборе
    setIsInputError(false);
    onSearch(animal); // Передаем имя животного напрямую
  };

  // Функция для закрытия выпадающего меню при клике вне его
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Закрыть меню при клике вне
    }
  };

  useEffect(() => {
    // Добавляем обработчик кликов по документу
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Удаляем обработчик кликов при размонтировании компонента
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center w-full max-w-[600px]" ref={dropdownRef}>
      {/* Поле ввода */}
      <div className={`flex items-center mr-4 border-2 rounded-xl overflow-hidden w-[240px] ${isInputError ? 'border-red-500 bg-red-100' : 'border-black bg-white'}`}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          className={`w-full px-4 py-2 focus:outline-none rounded-xl ${isInputError ? 'bg-red-100' : 'bg-white'}`}
          onChange={(e) => setSearchValue(e.target.value)}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        <img src={icon} alt="Input icon" className="h-6 w-6 mr-2" />
      </div>

      {/* Кнопка поиска справа от инпута */}
      <Button text="Search" variant="blue" icon="/icons/search_white.png" iconPosition="Search" onClick={handleSearch} />

      {/* Выпадающее меню с именами животных */}
      {isDropdownOpen && (
        <ul className="absolute top-full left-0 w-[240px] bg-white border-2 border-black rounded-xl mt-1 max-h-48 overflow-auto z-10">
          {animals.map((animal) => (
            <li
              key={animal}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectAnimal(animal)}
            >
              {animal}
            </li>
          ))}
        </ul>
      )}

      {/* Вывод ошибки под инпутом */}
      {isInputError && (
        <div className="mt-2 text-red-600 text-sm absolute top-full left-0">
          Animal not found.
        </div>
      )}
    </div>
  );
}

export default Search;
