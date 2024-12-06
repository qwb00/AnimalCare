import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import axios from "axios";
import API_BASE_URL from "../config";

function Search({ placeholder, icon, onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [suggestedAnimals, setSuggestedAnimals] = useState([]);
  const [isInputError, setIsInputError] = useState(false);
  const dropdownRef = useRef(null); // Ref для выпадающего меню

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const [animalResponse, reservationResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/animals`),
          axios.get(`${API_BASE_URL}/reservations`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }),
        ]);

        const animalData = animalResponse.data.map((animal) => ({
          name: animal.name,
          id: animal.id,
        }));
        setAnimals(animalData);

        const reservations = reservationResponse.data;
        const userID = sessionStorage.getItem("userID");
        const userReservations = reservations.filter(
          (reservation) => reservation.userId === userID
        );

        const reservedAnimalCounts = {};

        // Подсчет частоты резервирования для каждого животного
        userReservations.forEach((reservation) => {
          if (!reservedAnimalCounts[reservation.animalId]) {
            reservedAnimalCounts[reservation.animalId] = 0;
          }
          reservedAnimalCounts[reservation.animalId]++;
        });

        const reservedAnimals = Object.keys(reservedAnimalCounts)
          .map((id) => ({
            id,
            count: reservedAnimalCounts[id],
            name: animalData.find((animal) => animal.id === id)?.name,
          }))
          .filter((animal) => animal.name) // Убираем отсутствующие животные
          .sort((a, b) => b.count - a.count); // Сортируем по частоте

        const suggested = [];

        // Добавляем животных, которых пользователь резервировал чаще всего
        reservedAnimals.slice(0, 3).forEach((animal) => suggested.push(animal));

        // Если недостаточно данных, добавляем случайных животных
        if (suggested.length < 3) {
          const randomAnimals = getRandomAnimals(
            animalData.filter(
              (animal) =>
                !suggested.find(
                  (suggestedAnimal) => suggestedAnimal.id === animal.id
                )
            ),
            3 - suggested.length
          );
          suggested.push(...randomAnimals);
        }

        setSuggestedAnimals(suggested);
      } catch (error) {
        console.error("Error fetching animals or reservations:", error);
      }
    };

    loadAnimals();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Закрываем меню
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Генерация случайных животных
  const getRandomAnimals = (animals, count) => {
    if (animals.length <= count) {
      return animals;
    }
    const shuffled = [...animals].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Генерация уникального цвета для животных
  const generateColorFromId = (id) => {
    // Преобразование ID в числовое значение
    const numericId = Array.from(id.toString()).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );

    // Генерация уникального HSL
    const hue = (numericId * 137) % 360; // Используем "золотое" число для распределения
    const saturation = 90; // Высокая насыщенность
    const lightness = 50; // Средняя яркость для яркого цвета

    // Преобразуем HSL в HEX
    return hslToHex(hue, saturation, lightness);
  };

  // Функция для преобразования HSL в HEX
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      Math.round(
        255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
      );

    const r = f(0);
    const g = f(8);
    const b = f(4);

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)}`;

    return hex;
  };

  // Выбор животного
  const handleSelectAnimal = (animal) => {
    setSearchValue(animal.name);
    onSearch(animal.id);
    setIsDropdownOpen(false); // Закрываем меню
    setIsInputError(false);
  };

  return (
    <div
      className="relative flex flex-col w-full max-w-[600px]"
      ref={dropdownRef}
    >
      {/* Блок с инпутом, кнопкой и выпадающим меню */}
      <div className="relative w-full">
        <div className="flex items-center w-full">
          {/* Input field */}
          <div
            className={`relative flex items-center mr-4 border-2 rounded-xl w-[240px] ${
              isInputError
                ? "border-red-500 bg-red-100"
                : "border-black bg-white"
            }`}
          >
            <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              className={`w-full px-4 py-2 focus:outline-none rounded-xl ${
                isInputError ? "bg-red-100" : "bg-white"
              }`}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={() => setIsDropdownOpen(true)} // Открываем меню при клике на инпут
            />
            <img src={icon} alt="Input icon" className="h-6 w-6 mr-2" />
          </div>

          {/* Search button */}
          <Button
            text="Search"
            variant="blue"
            icon="/icons/search_white.png"
            iconPosition="Search"
            onClick={() => {
              const foundAnimal = animals.find(
                (animal) =>
                  animal.name.toLowerCase() === searchValue.toLowerCase()
              );
              if (foundAnimal) {
                onSearch(foundAnimal.id);
                setIsInputError(false);
              } else {
                setIsInputError(true);
              }
              setIsDropdownOpen(false); // Закрываем меню при поиске
            }}
          />
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-[240px] bg-white border-2 border-black rounded-xl mt-1 max-h-48 overflow-auto z-[9999]">
            {animals.length > 0 ? (
              animals.map((animal) => (
                <div
                  key={animal.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectAnimal(animal)}
                >
                  {animal.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No animals found</div>
            )}
          </div>
        )}
      </div>

      {/* Suggested Animals */}
      <div className="mt-4 w-full">
        <h3 className="text-lg font-semibold mb-2">Suggested Animals</h3>
        <div className="flex gap-4">
          {suggestedAnimals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleSelectAnimal(animal)}
              className="px-4 py-2 text-lg rounded-xl w-24 text-white"
              style={{
                backgroundColor: generateColorFromId(animal.id),
              }}
            >
              {animal.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
