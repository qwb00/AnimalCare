import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext"; // Импортируйте AppContext
import Button from "./Button";
import axios from "axios";
import API_BASE_URL from "../config";

function Search({ placeholder, icon, onSearch }) {
  const { calendarUpdated, suggestedAnimals, updateSuggestedAnimals } =
    useContext(AppContext);

  const dropdownRef = useRef(null);

  const [isInitialAnimalSet, setIsInitialAnimalSet] = useState(false);

  useEffect(() => {
    // При первом рендере передаем самое популярное животное
    if (suggestedAnimals.length > 0 && !isInitialAnimalSet) {
      handleSelectAnimal(suggestedAnimals[0]); // Выбираем первое животное из списка
      setIsInitialAnimalSet(true); // Устанавливаем флаг, чтобы больше не вызывать
    }
  }, [suggestedAnimals, isInitialAnimalSet]);

  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [isInputError, setIsInputError] = useState(false);
  const [hoveredAnimal, setHoveredAnimal] = useState(null); // State for hovered animal

  useEffect(() => {
    updateSuggestedAnimals();
  }, [calendarUpdated, updateSuggestedAnimals]);

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`);

        const animalData = response.data.map((animal) => ({
          name: animal.name,
          id: animal.id,
          breed: animal.breed, // Assuming `breed` is part of the animal data
          age: animal.age, // Assuming `age` is part of the animal data
          personality: animal.personality, // Assuming `personality` is part of the animal data
          weight: animal.weight, // Assuming `weight` is part of the animal data
          photo: animal.photo, // Assuming `photo` is part of the animal data
        }));
        setAnimals(animalData);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    loadAnimals();
  }, []);

  const handleMouseEnter = (animal) => {
    setHoveredAnimal(animal); // Show hovered animal details
  };

  const handleMouseLeave = () => {
    setHoveredAnimal(null); // Hide details on mouse leave
  };

  const handleSearch = () => {
    if (!searchValue) {
      setIsInputError(true);
      return;
    }

    const foundAnimal = animals.find(
      (animal) => animal.name.toLowerCase() === searchValue.toLowerCase()
    );

    if (foundAnimal) {
      setIsInputError(false);
      onSearch(foundAnimal.id);
    } else {
      setIsInputError(true);
    }

    setIsDropdownOpen(false);
  };

  const handleSelectAnimal = (animal) => {
    setSearchValue(animal.name);
    setIsDropdownOpen(false);
    setIsInputError(false);
    setHoveredAnimal(null); // Скрыть карточку животного при выборе
    onSearch(animal.id);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function generatePastelColor(id) {
    // Генерируем числовой хеш на основе ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Извлекаем базовые компоненты (HSL)
    let hue = Math.abs(hash % 360); // Угол цвета в градусах (0-360)
    let saturation = 60 + (hash % 20); // Насыщенность 60-80%
    let lightness = 70 + (hash % 10); // Светлота 70-80% (светлые пастельные тона)
  
    // Исключаем коричневые и бежевые тона
    while ((hue >= 30 && hue <= 50) || (hue >= 20 && hue <= 60)) {
      hue = (hue + 60) % 360; // Сдвигаем оттенок на 60° для получения другого цвета
    }
  
    // Возвращаем цвет в формате HSL
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  

  return (
    <div className="relative w-full max-w-[600px]" ref={dropdownRef}>
      {/* Grouping everything except Suggested Animals */}
      <div className="relative">
        <div className="flex items-center">
          <div
            className={`flex items-center mr-4 border-2 rounded-xl overflow-hidden w-[240px] ${
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
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <img src={icon} alt="Input icon" className="h-6 w-6 mr-2" />
          </div>

          <Button
            text="Search"
            variant="blue"
            icon="/icons/search_white.png"
            iconPosition="Search"
            onClick={handleSearch}
          />
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <ul
            className="absolute top-full left-0 w-[240px] bg-white border-2 border-black rounded-xl mt-1 overflow-auto z-10"
            style={{
              maxHeight: "285px",
              minHeight: animals.length === 1 ? "40px" : "auto",
            }}
          >
            {animals.map((animal) => (
              <li
                key={animal.id}
                className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                onMouseEnter={() => handleMouseEnter(animal)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleSelectAnimal(animal)}
              >
                <span>{animal.name}</span>
                <a
                  href={`/animals/${animal.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 text-main-blue hover:text-blue-700"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering onClick of <li>
                >
                  <img
                    src="/icons/info.png" // Укажите путь к вашей иконке
                    alt="Info"
                    className="w-5 h-5"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Hovered animal details */}
        {hoveredAnimal && (
          <div
            className="absolute left-[255px] bg-white border-2 border-black rounded-xl shadow-lg p-4 z-20 w-[300px]"
            style={{
              top: "calc(100% + 5px)", // Начало карточки на той же высоте, что и дропдаун
            }}
          >
            {hoveredAnimal.photo && (
              <img
                src={hoveredAnimal.photo}
                alt={hoveredAnimal.name}
                className="w-full h-40 object-cover border-2 border-black rounded-lg mb-4"
              />
            )}
            <h4 className="text-xl font-semibold">{hoveredAnimal.name}</h4>
            <p>
              <strong>Breed:</strong> {hoveredAnimal.breed || "Unknown"}
            </p>
            <p>
              <strong>Age:</strong> {hoveredAnimal.age || "Unknown"}
            </p>
            <p>
              <strong>Weight:</strong> {hoveredAnimal.weight || "Unknown"} kg
            </p>
            <p>
              <strong>Personality:</strong>{" "}
              {hoveredAnimal.personality || "Not specified"}
            </p>
          </div>
        )}

        {isInputError && (
          <div className="mt-2 text-red-600 text-sm absolute top-full left-0">
            Animal not found.
          </div>
        )}
      </div>

      {/* Suggested Animals */}
      {suggestedAnimals.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Suggested Animals</h3>
          <ul className="flex flex-col gap-2">
            {suggestedAnimals.map((animal) => (
              <li
                key={animal.id}
                className="flex justify-between items-center px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectAnimal(animal)}
                style={{ backgroundColor: generatePastelColor(animal.id) }}
              >
                <span>{animal.name}</span>
                {animal.photo && (
                  <img
                    src={animal.photo}
                    alt={animal.name}
                    className="w-10 h-10 rounded-full border border-black"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Search;
