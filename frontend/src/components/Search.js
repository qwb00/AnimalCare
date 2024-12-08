import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import axios from "axios";
import API_BASE_URL from "../config";

function Search({ placeholder, icon, onSearch }) {
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
        }));
        setAnimals(animalData);
        console.log("Loaded animals from API:", animalData);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    loadAnimals();
  }, []);

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
      <div
          className="relative flex items-center w-full max-w-[600px]"
          ref={dropdownRef}
      >
        {/* Input field */}
        <div
            className={`flex items-center mr-4 border-2 rounded-xl overflow-hidden w-[240px] ${
                isInputError ? "border-red-500 bg-red-100" : "border-black bg-white"
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

        {/* Search button next to input */}
        <Button
            text="Search"
            variant="blue"
            icon="/icons/search_white.png"
            iconPosition="Search"
            onClick={handleSearch}
        />

        {/* Dropdown menu with animal names */}
        {isDropdownOpen && (
            <ul className="absolute top-full left-0 w-[240px] bg-white border-2 border-black rounded-xl mt-1 max-h-48 overflow-auto z-10">
              {animals.map((animal) => (
                  <li
                      key={animal.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectAnimal(animal)}
                  >
                    {animal.name}
                  </li>
              ))}
            </ul>
        )}

        {/* Display error under input if animal not found */}
        {isInputError && (
            <div className="mt-2 text-red-600 text-sm absolute top-full left-0">
              Animal not found.
            </div>
        )}
      </div>
  );
}

export default Search;