import React, { useState, useEffect, useRef } from 'react';
import Button from './Button'; // Импортируем компонент Button

// Массив с животными для выбора
const animals = ['Lola', 'Peanut', 'Kelly'];

function Search({ placeholder, icon, onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Управляет состоянием выпадающего меню
  const [searchResult, setSearchResult] = useState(null); // Хранит результат поиска
  const [isInputError, setIsInputError] = useState(false); // Управляет состоянием ошибки ввода
  const dropdownRef = useRef(null); // Ссылка на выпадающее меню для отслеживания кликов вне его

  // Функция для поиска животного
  const handleSearch = () => {
    if (!searchValue) {
      setIsInputError(true); // Установить ошибку, если поле пустое
      return;
    }

    if (animals.includes(searchValue)) {
      setSearchResult(`Animal "${searchValue}" is selected!`);
      onSearch(`Animal "${searchValue}" is selected!`);
    } else {
      setSearchResult(`Animal "${searchValue}" not found.`);
      onSearch(`Animal "${searchValue}" not found.`);
    }
    setIsDropdownOpen(false); // Закрыть выпадающее меню при нажатии на кнопку Search
    setIsInputError(false); // Сбросить ошибку
  };

  // Функция для выбора животного из выпадающего меню
  const handleSelectAnimal = (animal) => {
    setSearchValue(animal);
    setIsDropdownOpen(false); // Закрыть меню при выборе
    setSearchResult(`Animal "${animal}" is selected!`);
    onSearch(`Animal "${animal}" is selected!`);
    setIsInputError(false); // Сбросить ошибку при выборе животного
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
      <div className={`flex items-center  mr-4 border-2 rounded-xl overflow-hidden w-[240px] ${isInputError ? 'border-red-500 bg-red-100' : 'border-black bg-white'}`}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          className={`w-full px-4 py-2 focus:outline-none rounded-xl ${isInputError ? 'bg-red-100' : 'bg-white'}`} // Фон инпута
          onChange={(e) => setSearchValue(e.target.value)} // Обновляем значение инпута
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Показать/скрыть выпадающее меню
        />
        <img src={icon} alt="Input icon" className="h-6 w-6 mr-2" />
      </div>

      {/* Кнопка поиска справа от инпута */}
      <Button text="Search" variant="blue" icon="/icons/search_white.png" iconPosition="Search" onClick={handleSearch} /> {/* Добавляем обработчик клика */}

      {/* Выпадающее меню с именами животных */}
      {isDropdownOpen && (
        <ul className="absolute top-full left-0 w-[240px] bg-white border-2 border-black rounded-xl mt-1 max-h-48 overflow-auto z-10">
          {animals.map((animal) => (
            <li
              key={animal}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectAnimal(animal)} // Выбираем животное
            >
              {animal}
            </li>
          ))}
        </ul>
      )}

      {/* Вывод результата поиска под инпутом */}
      {searchResult && (
        <div className="mt-2 text-gray-600 text-sm absolute top-full left-0">{searchResult}</div>
      )}
    </div>
  );
}

export default Search;
