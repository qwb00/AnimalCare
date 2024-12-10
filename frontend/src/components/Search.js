import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import axios from "axios";
import API_BASE_URL from "../config";

function Search({ placeholder, icon, onSearch, initialAnimalName = "" }) {
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
  const dropdownRef = useRef(null); // Ref for dropdown to detect outside clicks

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`);
        const animalData = response.data.map((animal) => ({
          name: animal.name,
          id: animal.id,
          breed: animal.breed,
          age: animal.age,
          personality: animal.personality,
          weight: animal.weight,
          photo: animal.photo,
        }));
        setAnimals(animalData);

        // Если у нас есть initialAnimalName, попробуем сразу выбрать это животное
        if (initialAnimalName) {
          const foundAnimal = animalData.find(
            (animal) =>
              animal.name.toLowerCase() === initialAnimalName.toLowerCase()
          );
          if (foundAnimal) {
            handleSelectAnimal(foundAnimal);
          } else {
            // Если животное не найдено, просто установим значение в инпут
            setSearchValue(initialAnimalName);
          }
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    loadAnimals();
  }, [initialAnimalName]);

  // Search function for finding an animal by name
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

  // Select an animal from the dropdown menu
  const handleSelectAnimal = (animal) => {
    setSearchValue(animal.name); // Display selected name in input
    setIsDropdownOpen(false); // Close menu on selection
    setIsInputError(false);
    onSearch(animal.id);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Close menu on outside click
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full">
      {/* Search Block (left aligned) */}
      <div className="relative w-full max-w-[600px]" ref={dropdownRef}>
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
                  className="flex justify-between items-center pl-4 pr-1 py-1 cursor-pointer hover:bg-gray-100"
                  onMouseEnter={() => handleMouseEnter(animal)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleSelectAnimal(animal)}
                >
                  <span>{animal.name}</span>
                  <a
                    href={`/animals/${animal.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 w-10 h-10 flex items-center justify-center hover:bg-main-blue rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src="/icons/info.png" alt="Info" className="w-5 h-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}

          {hoveredAnimal && (
            <div
              className="absolute left-[255px] bg-white border-2 border-black rounded-xl shadow-lg p-4 z-20 w-[300px]"
              style={{
                top: "calc(100% + 5px)",
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
      </div>

      {/* Suggested Animals (right aligned) */}
      {suggestedAnimals.length > 0 && (
        <div className="text-right items-center flex">
          <h3 className="w-48 text-xl mr-4 font-semibold">
            Suggested Animals:
          </h3>
          <div className="flex flex-row justify-end items-center gap-2">
            {suggestedAnimals.map((animal) => (
              <Button
                key={animal.id}
                variant="white"
                text={animal.name}
                onClick={() => handleSelectAnimal(animal)}
                className="px-6"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;