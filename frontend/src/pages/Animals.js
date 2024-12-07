import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimalCard from "../components/AnimalCard";
import axios from "axios";
import API_BASE_URL from "../config";
import Button from "../components/Button";
import FileUploader from "../components/FileUploader";
import ErrorMessages from '../components/ErrorMessages';
import "react-range-slider-input/dist/style.css";
import RangeSlider from "react-range-slider-input";

function Animals() {
  const [allAnimals, setAllAnimals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notification, setNotification] = useState({
    isSuccess: true,
    message: "",
  });
  const [photoUrl, setPhotoUrl] = useState(null);
  const [userRole, setUserRole] = useState("");

  const animalsPerPageForAdmin = 5;
  const animalsPerPageForUser = 6;
  const animalsPerPage =
    userRole === "Caretaker" || userRole === "Administrator"
      ? animalsPerPageForAdmin
      : animalsPerPageForUser;
  const totalPages = Math.ceil(allAnimals.length / animalsPerPage);
  const [filters, setFilters] = useState({
    minAge: "",
    maxAge: "",
    weight: "",
    sex: "",
    type: "",
    breed: "",
    searchTerm: "",
  });
  

  const [currentPage, setCurrentPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [size, setSize] = useState("");
  const [health, setHealth] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const [personality, setPersonality] = useState("");
  const [history, setHistory] = useState("");
  const [errorData, setErrorData] = useState(null);

  const loadAllAnimals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals`, {
        headers: {
          Accept: "application/json",
        },
      });

      const data = response.data;
      if (response.data) {
        // Filter only active animals
        const activeAnimals = data.filter((animal) => animal.isActive);
        setAllAnimals(activeAnimals);
      }
    } catch (error) {
      console.error("Error fetching animals:", error);
    }
  };


  useEffect(() => {
    const storedUserRole = sessionStorage.getItem("role");
    setUserRole(storedUserRole);

    console.log("User role:", storedUserRole);

    loadAllAnimals();
  }, []);

  useEffect(() => {
    const applyFiltersAsync = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`, {
          params: {
            minAge: filters.minAge || undefined,
            maxAge: filters.maxAge || undefined,
            weight: filters.weight || undefined,
            sex: filters.sex || undefined,
            type: filters.type || undefined,
            breed: filters.breed || undefined,
            searchTerm: filters.searchTerm || undefined,
          },
          headers: {
            Accept: "application/json",
          },
        });
  
        const data = response.data;
        if (data) {
          const activeAnimals = data.filter((animal) => animal.isActive);
          setAllAnimals(activeAnimals);
          setCurrentPage(1); // Сбрасываем на первую страницу после применения фильтров
        }
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    };
  
    // Применяем фильтры только если они изменились
    applyFiltersAsync();
  }, [filters]);

  const startIndex = (currentPage - 1) * animalsPerPage;
  const endIndex = startIndex + animalsPerPage;

  const currentAnimals = allAnimals.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxPageNumbers = 5;

    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPageNumbers; i++) {
          pages.push(i);
        }
        pages.push("...", totalPages);
      } else if (currentPage > totalPages - 3) {
        pages.push(1, "...");
        for (let i = totalPages - maxPageNumbers + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...", totalPages);
      }
    }

    return pages;
  };

  const goToPage = (page) => {
    if (page === "..." || page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddAnimal = async () => {
    try {
      const animalData = {
        name,
        breed,
        age: parseInt(age),
        weight: weight ? parseInt(weight) : 0,
        photo: photoUrl,
        sex: sex === "Male" ? 0 : 1,
        size: size === "Small" ? 0 : size === "Medium" ? 1 : size === "Large" ? 2 : 3,
        health: health === "Good" ? 0 : health === "Fair" ? 1 : 2,
        species: species === "Dog" ? 0 : 1,
        history,
        personality,
        dateFound: foundDate && !isNaN(new Date(foundDate)) ? new Date(foundDate).toISOString() : null,
      };

      console.log("Animal data:", animalData);

      const authToken = sessionStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/animals`, animalData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 201) {
        setNotification({ isSuccess: true, message: "Animal added successfully!" });
        setIsNotificationOpen(true);
        loadAllAnimals(); // Refresh list
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error adding animal:", error);
      setErrorData(error);
      setNotification({ isSuccess: false, message: <ErrorMessages errorData={error.response?.data} />  });
      setIsNotificationOpen(true);
      return;
    }
  };

  const handleDeactivateAnimal = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/animals/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify([
          { op: "replace", path: "/isActive", value: false },
        ]),
      });

      if (!response.ok) throw new Error(`Failed to deactivate animal: ${await response.text()}`);

      // Remove deactivated animal from the list
      setAllAnimals((prev) => prev.filter((animal) => animal.id !== id));
    } catch (error) {
      console.error("Error deactivating animal:", error);
      setNotification({ isSuccess: false, message: "Error deactivating animal." });
      setIsNotificationOpen(true);
    }
  };


  return (
    <div className="max-w-screen-lg mx-auto">
      <Header />

      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-black mt-8 mb-2">OUR ANIMALS</h1>
      </div>

      <div className="filter-section mb-4">
        {/* Toggle Button */}
        <div className="mx-auto p-4">
          <Button
            variant="blue" 
            text= {filtersVisible ? "Hide Filters" : "Show Filters"}
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="px-6 py-3 rounded-lg transform transition-transform"
          >

          </Button>
        </div>


  {/* Filters */}
  {filtersVisible && (
    <div className="filter-container mt-4 bg-white shadow-md p-6 rounded-xl border border-gray-200">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">
            Age Range: {filters.minAge} - {filters.maxAge} years
          </label>
          <RangeSlider
            min={0}
            max={25}
            value={[filters.minAge, filters.maxAge]}
            onInput={(values) =>
              setFilters({ ...filters, minAge: values[0], maxAge: values[1] })
            }
            className="range-slider"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">
            Max Weight: {filters.weight} kg
          </label>
          <input
            type="range"
            min="1"
            max="35"
            value={filters.weight}
            onChange={(e) =>
              setFilters({ ...filters, weight: Number(e.target.value) })
            }
            className="my-range"
            style={{
              background: `linear-gradient(to right, #4BD4FF ${(filters.weight / 35) * 100}%, #e0e0e0 ${(filters.weight / 35) * 100}%)`,
            }}
          />
        </div>

        <select
          value={filters.sex}
          onChange={(e) => setFilters({ ...filters, sex: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-main-blue"
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-main-blue"
        >
          <option value="">Select Type</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>

        <input
          type="text"
          placeholder="Breed"
          value={filters.breed}
          onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-blue"
        />

        <input
          type="text"
          placeholder="Enter name"
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters({ ...filters, searchTerm: e.target.value })
          }
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-blue"
        />
        <div></div>
        <div className="flex justify-end col-span-full lg:col-span-1">
          <Button
            text="Apply filters" 
            variant="blue" 
            className="px-6 py-3 rounded-lg transition-all"
          >
          </Button>
        </div>
      </form>
    </div>
  )}
</div>


      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentAnimals.map((animal, index) => (
            <AnimalCard
              key={`${animal.id}-${index}`}
              id={animal.id}
              image={animal.photo}
              name={animal.name}
              age={`${animal.age} years`}
              breed={animal.breed}
              userRole={userRole}
              onDelete={handleDeactivateAnimal}
            />
          ))}

          {userRole &&
            (userRole === "Caretaker" || userRole === "Administrator") && (
              <div
                className="rounded-xl bg-main-blue h-[500px] flex flex-col justify-start items-center cursor-pointer hover:scale-105 transition-transform"
                onClick={handleOpenModal}
              >
                <div className="text-center text-white text-3xl font-bold mt-20">
                  New Animal
                </div>
                <div className="w-48 h-48 rounded-full border-8 border-white flex items-center justify-center mt-20">
                  <img
                    src="/icons/plus_white.png"
                    alt="New"
                    className="w-20 h-20"
                  />
                </div>
              </div>
            )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-3 my-6 mt-12">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-5 py-3 bg-main-blue text-white rounded-xl text-xl"
            >
              Previous
            </button>
          )}

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => goToPage(page)}
              className={`px-5 py-3 rounded-xl text-xl ${
                page === currentPage
                  ? "bg-main-blue text-white"
                  : "bg-white border-black border text-black"
              } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-5 py-3 bg-main-blue text-white rounded-xl text-xl"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Modal for adding new animal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black"
            onClick={(e) => {
              if (e) e.stopPropagation();
            }}
          >
            <h3 className="text-xl font-bold mb text-center text-gray-800">
              ADD NEW ANIMAL
            </h3>

            <button
              type="button"
              className="absolute top-3 right-3 bg-main-blue rounded-full p-2"
              aria-label="Close"
              style={{ transform: "rotate(45deg)" }}
              onClick={handleCloseModal}
            >
              <img
                src="/icons/plus_white.png"
                alt="Close"
                className="w-3 h-3"
              />
            </button>

            <div className="mb-1">
              <label className="block text-gray-700 mb-1 font-medium text-xs">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter animal’s name"
                className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-1 relative">
              <label className="block text-gray-700 mb-1 font-medium text-xs">
                Species
              </label>
              <div className="relative">
                <select
                  className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                >
                  <option value="">Select species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 mb-1 font-medium text-xs">
                Breed
              </label>
              <input
                type="text"
                placeholder="Enter animal’s breed"
                className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-xs"
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mb-1">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1 font-medium text-xs">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Enter animal’s age"
                  min="0"
                  max="25"
                  className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-xs"
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 mb-1 font-medium text-xs">
                  Weight
                </label>
                <input
                  type="number"
                  placeholder="Enter animal’s weight"
                  min="0"
                  max="35"
                  className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-xs"
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              

              <div className="flex-1 relative">
                <label className="block text-gray-700 mb-1 font-medium text-xs">
                  Sex
                </label>
                <select
                  className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="">Select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mb-1">
              <div className="flex-1 relative">
                <label className="block text-gray-700 mb-1 font-medium text-xs">
                  Size
                </label>
                <select
                  className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="">Select size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="ExtraLarge">ExtraLarge</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <label className="block text-gray-700 mb-1 font-medium text-xs">
                  Health Conditions
                </label>
                <select
                  className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
                  value={health}
                  onChange={(e) => setHealth(e.target.value)}
                >
                  <option value="">Select health conditions</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 mb-1 font-medium text-xs">
                Found date
              </label>
              <input
                type="date"
                className="w-full p-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
                placeholder="Enter when animal was found"
                value={foundDate}
                onChange={(e) => setFoundDate(e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label className="block text-gray-700 mb-1 font-medium text-xs">
                Personality
              </label>
              <input
                type="text"
                className="w-full p-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
                placeholder="Enter animal’s personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
              />
            </div>

            <div className="mb-2 relative">
              <label className="block text-gray-700 mb-1 font-medium text-xs">
                History
              </label>
              <textarea
                maxLength="2000"
                className="w-full p-1.5 h-12 max-h-16 min-h-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
                placeholder="Write history of animal"
                rows="4"
                value={history}
                onChange={(e) => setHistory(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-2">
              <FileUploader
                onUpload={(uploadedUrl) => setPhotoUrl(uploadedUrl)}
                onStatusChange={(status) => {
                  if (status === "success") {
                    console.log("File uploaded successfully");
                  } else if (status === "error") {
                    console.log("File upload failed");
                  }
                }}
                buttonText="Upload Photo"
                buttonClassName="h-10 w-36 border border-gray-300 rounded-md text-sm"
                icon="/icons/upload_photo.png"
                iconSize="w-5 h-5"
                isButton={true}
              />
            </div>

            <div className="flex justify-center space-x-2 mt-4">
              <Button
                text="Cancel"
                variant="white"
                iconSize="w-5 h-5"
                icon="/icons/cancel.png"
                iconPosition="right"
                className="px-5 py-2 text-sm"
                onClick={handleCloseModal}
              />
              <Button
                text="Confirm"
                variant="blue"
                iconSize="w-5 h-5"
                icon="/icons/confirm_white.png"
                iconPosition="right"
                className="px-5 py-2 text-sm"
                onClick={handleAddAnimal}
              />
            </div>
          </div>
        </div>
      )}
      
      {isNotificationOpen && (
          <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={() => setIsNotificationOpen(false)}
          >
            <div
                className={`bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 ${
                    notification.isSuccess ? "border-green-600" : "border-red-600"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
              <h3
                  className={`text-2xl font-bold mb-6 text-center ${
                      notification.isSuccess ? "text-green-600" : "text-red-600"
                  }`}
              >
                {notification.isSuccess ? "Success!" : "Error"}
              </h3>
              <p className="text-lg mb-6 text-center text-gray-800">
                {notification.message}
              </p>
              <div className="flex justify-center">
                <Button
                    text="Close"
                    variant="blue"
                    icon="/icons/cancel_white.png"
                    iconPosition="right"
                    className="px-5 py-2"
                    onClick={() => setIsNotificationOpen(false)}
                />
              </div>
            </div>
          </div>
      )}

      <Footer />
    </div>
  );
}

export default Animals;
