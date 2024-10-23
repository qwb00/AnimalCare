import React, { useState } from 'react';
import Header from '../components/Header'; // Импортируем компонент Header
import Button from '../components/Button'; // Импортируем кнопку
import Input from '../components/Input'; // Импортируем компонент Input

// Массив с животными для выбора
const animals = ['Lola', 'Peanut', 'Kelly'];

function Reservations() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null); // Хранит результат поиска
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Управляет состоянием выпадающего меню

  // Функция для поиска животного
  const handleSearch = () => {
    if (animals.includes(searchValue)) {
      setSearchResult(`Animal "${searchValue}" is selected!`);
    } else {
      setSearchResult(`Animal "${searchValue}" not found.`);
    }
  };

  // Функция для выбора животного из выпадающего меню
  const handleSelectAnimal = (animal) => {
    setSearchValue(animal);
    setIsDropdownOpen(false); // Закрыть меню при выборе
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Хедер */}
      <Header />

      {/* Основной контент */}
      <div className="flex flex-col items-start justify-center mt-16 w-full max-w-[1024px] mx-auto px-4">
        {/* Заголовок WALKING SCHEDULE */}
        <h1 className="text-4xl font-black text-center mb-8 w-full">WALKING SCHEDULE</h1>

        {/* Заголовок Weekly Schedule с иконкой */}
        <div className="flex items-center justify-start w-full mb-6">
          <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
          <img src="/icons/calendar_black.png" alt="Calendar icon" className="h-6 w-6 ml-2" />
        </div>

        {/* Поле ввода для поиска по имени животного и кнопка поиска */}
        <div className="relative w-full mb-8">
          <Input
            placeholder="Animal's name"
            icon="/icons/pen.png"
            onChange={(e) => setSearchValue(e.target.value)} // Обновляем значение инпута
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Показать/скрыть выпадающее меню
          />
          
          {/* Выпадающее меню с именами животных */}
          {isDropdownOpen && (
            <ul className="absolute top-full left-0 w-full bg-white border-2 border-black rounded-xl mt-1 max-h-48 overflow-auto z-10">
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
        </div>

        <Button
          text="Search"
          variant="blue"
          icon="/icons/search_white.png"
          iconPosition="right"
          className="ml-4"
          onClick={handleSearch} // Обработчик клика для поиска
        />

        {/* Результат поиска */}
        {searchResult && (
          <div className="mt-4 text-lg font-semibold">
            {searchResult}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservations;
