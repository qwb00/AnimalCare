import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import AnimalCard from "../components/AnimalCard";
import FileUploader from "../components/FileUploader";
import ErrorMessages from "../components/ErrorMessages";

function AnimalDetails() {
  const { animalID } = useParams();
  const [animalData, setAnimalData] = useState(null); // Detailed data of the selected animal
  const [otherAnimals, setOtherAnimals] = useState([]); // Other animals for suggestions
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [errorMessages, setErrorMessages] = useState([]);

  const authToken = sessionStorage.getItem("token");

  // State variables to toggle general editer data
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  // Initialize edited data with the initial animal data
  const [editedGeneralData, setEditedGeneralData] = useState({
    name: animalData?.name || "Unknown",
    species: animalData?.species === "Dog" ? 0 : 1,
    breed: animalData?.breed || "Undetermined",
    age: animalData?.age || 0,
    sex: animalData?.sex === "Male" ? 0 : 1,
    size:
      animalData?.size === "Small"
        ? 0
        : animalData?.size === "Medium"
        ? 1
        : animalData?.size === "Large"
        ? 2
        : 3,
    weight: animalData?.weight || 0,
    health:
      animalData?.health === "Good" ? 0 : animalData?.health === "Fair" ? 1 : 2,
    personality: animalData?.personality || "Undetermined",
  });

  // State variables to toggle history editor data
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  // Initialize edited history with the initial animal data
  const [editedHistory, setEditedHistory] = useState(animalData?.history || "");

  // State variables to toggle medical editor data
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  // Initialize edited medical data with the initial animal data
  const [editedMedicalData, setEditedMedicalData] = useState({
    lastExamination: animalData?.lastExamination || "",
    isVaccinated: animalData?.isVaccinated,
    isSterilized: animalData?.isSterilized,
    isChipped: animalData?.isChipped,
  });

  // State variables to toggle behavior editor data
  const [isEditingBehavior, setIsEditingBehavior] = useState(false);
  // Initialize edited behavior data with the initial animal data
  const [editedBehaviorData, setEditedBehaviorData] = useState({
    isPeopleFriendly: animalData?.isPeopleFriendly,
    isAnimalFriendly: animalData?.isAnimalFriendly,
    isCommandsTaught: animalData?.isCommandsTaught,
    isLeashTrained: animalData?.isLeashTrained,
  });

  // Check if the user is authorized to edit the animal data
  const userRole = sessionStorage.getItem("role");
  const isEditable = userRole === "Caretaker" || userRole === "Administrator";

  const extractErrorMessages = (errorData) => {
    const errorMessages = [];
    try {
      if (typeof errorData === "string") {
        errorMessages.push(errorData);
      } else if (typeof errorData === "object" && errorData.errors) {
        for (const key in errorData.errors) {
          if (Array.isArray(errorData.errors[key])) {
            errorMessages.push(...errorData.errors[key]);
          } else {
            errorMessages.push(errorData.errors[key]);
          }
        }
      } else if (typeof errorData === "object") {
        for (const key in errorData) {
          if (Array.isArray(errorData[key])) {
            errorMessages.push(...errorData[key]);
          } else {
            errorMessages.push(errorData[key]);
          }
        }
      } else {
        errorMessages.push("An unknown error occurred.");
      }
    } catch (err) {
      console.error("Error extracting error messages:", err);
      errorMessages.push("Failed to process error messages.");
    }
    return errorMessages;
  };

  // Fetch detailed data of the selected animal
  const fetchAnimalDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals/${animalID}`);
      setAnimalData(response.data);
      setErrorMessages([]);
    } catch (error) {
      console.error("Error fetching animal details:", error);
      const errorData = error.response?.data || "An unknown error occurred.";
      setErrorMessages(extractErrorMessages(errorData));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch other animals for suggestions
  const fetchOtherAnimals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals`);

      // Filter out the current animal from the list to avoid duplicate animal suggestions
      const allAnimals = response.data.filter(
        (animal) => animal.id !== animalID
      );

      // Shuffle and select the first 3 animals (get 3 random animals from API)
      const randomAnimals = allAnimals
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setOtherAnimals(randomAnimals);
    } catch (error) {
      console.error("Error fetching other animals:", error);
    }
  };

  // Fetch details of specific animal and suggested animals on page load and when animalID changes
  useEffect(() => {
    fetchAnimalDetails();
    fetchOtherAnimals();
  }, [animalID]);

  // Function to update animal attribute in the database
  async function updateAnimalAttribute(path, value) {
    console.log(`Updating ${path} with value:`, value);

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/animals/${animalID}`,
        [
          {
            op: "replace",
            path: `/${path}`,
            value: value,
          },
        ],
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json-patch+json",
          },
        }
      );
      setErrorMessages([]);
      return response;
    } catch (error) {
      console.error(`Error on update ${path}:`, error);

      const errorData = error.response?.data || "Unknown error";
      const extractedErrors = extractErrorMessages(errorData);

      setErrorMessages((prevErrors) => [...prevErrors, ...extractedErrors]);

      throw error;
    }
  }

  // Functions to handle editing and saving changes
  const handleEditGeneralToggle = () => {
    // Open editer mode
    setIsEditingGeneral(true);

    // Set animal data to inital data from API or updated data
    setEditedGeneralData({
      name: animalData?.name,
      species: animalData?.species,
      breed: animalData?.breed,
      age: animalData?.age,
      sex: animalData?.sex,
      size: animalData?.size,
      weight: animalData?.weight,
      health: animalData?.health,
      personality: animalData?.personality,
    });
  };

  // Fuction to apply changes to general data
  const handleSaveGeneralChanges = async () => {
    try {
      await updateAnimalAttribute("name", editedGeneralData.name);
      await updateAnimalAttribute("species", editedGeneralData.species);
      await updateAnimalAttribute("breed", editedGeneralData.breed);
      await updateAnimalAttribute("age", editedGeneralData.age);
      await updateAnimalAttribute("sex", editedGeneralData.sex);
      await updateAnimalAttribute("size", editedGeneralData.size);
      await updateAnimalAttribute("weight", editedGeneralData.weight);
      await updateAnimalAttribute("health", editedGeneralData.health);
      await updateAnimalAttribute("personality", editedGeneralData.personality);

      setAnimalData({
        ...animalData,
        ...editedGeneralData,
      });

      // close editing mode
      setIsEditingGeneral(false);
    } catch (error) {
      console.error("Error of saving: ", error);
    }
  };

  // Close editor mode and reset data to initial data
  const handleCancelGeneralChanges = () => {
    setEditedGeneralData(animalData);
    setIsEditingGeneral(false);
  };

  // Function to toggle history editor mode
  const handleEditHistoryToggle = () => {
    // Open editor mode
    setIsEditingHistory(!isEditingHistory);

    // Set edited history to initial history from API or updated history
    if (isEditingHistory) {
      setEditedHistory(animalData?.history || "");
    }
  };

  // Function to save changes to history
  const handleSaveHistoryChanges = async () => {
    try {
      // PATCH request to update history attribute
      updateAnimalAttribute("history", editedHistory);

      // Update animal data with updated history
      setAnimalData({
        ...animalData,
        history: editedHistory,
      });
      console.log("History updated:", editedHistory);

      // Close editor mode
      setIsEditingHistory(false);
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  // Function to cancel changes to history
  const handleCancelHistoryChanges = () => {
    setIsEditingHistory(false);
  };

  // Function to convert date string to date input format
  const toDateInputFormat = (dateString) => {
    return dateString ? dateString.split("T")[0] : "";
  };

  // Function to toggle medical editor mode
  const handleEditMedicalToggle = () => {
    setIsEditingMedical(true);
    setEditedMedicalData({
      lastExamination: animalData?.lastExamination,
      isVaccinated: animalData?.isVaccinated,
      isSterilized: animalData?.isSterilized,
      isChipped: animalData?.isChipped,
    });
  };

  // Function to save changes to medical data
  const handleSaveMedicalChanges = async () => {
    try {
      console.log("Edited medical data:", editedMedicalData);

      updateAnimalAttribute(
        "lastExamination",
        editedMedicalData.lastExamination
      );
      updateAnimalAttribute("isVaccinated", editedMedicalData.isVaccinated);
      updateAnimalAttribute("isSterilized", editedMedicalData.isSterilized);
      updateAnimalAttribute("isChipped", editedMedicalData.isChipped);

      setAnimalData({
        ...animalData,
        lastExamination: editedMedicalData.lastExamination,
        isVaccinated: editedMedicalData.isVaccinated,
        isSterilized: editedMedicalData.isSterilized,
        isChipped: editedMedicalData.isChipped,
      });
      console.log("Medical data updated:", editedMedicalData);

      setIsEditingMedical(false);
    } catch (error) {
      console.error("Error updating medical data:", error);
    }
  };

  const handleCancelMedicalChanges = () => {
    setIsEditingMedical(false);
    setEditedMedicalData({
      lastExamination: animalData?.lastExamination || "",
      isVaccinated: animalData?.isVaccinated || false,
      isSterilized: animalData?.isSterilized || false,
      isChipped: animalData?.isChipped || false,
    });
  };

  const handleEditBehaviorToggle = () => {
    setIsEditingBehavior(true);
    setEditedBehaviorData({
      isPeopleFriendly: animalData?.isPeopleFriendly,
      isAnimalFriendly: animalData?.isAnimalFriendly,
      isCommandsTaught: animalData?.isCommandsTaught,
      isLeashTrained: animalData?.isLeashTrained,
    });
  };

  const handleSaveBehaviorChanges = async () => {
    try {
      console.log("Edited behavior data:", editedBehaviorData);

      updateAnimalAttribute(
        "isPeopleFriendly",
        editedBehaviorData.isPeopleFriendly
      );
      updateAnimalAttribute(
        "isAnimalFriendly",
        editedBehaviorData.isAnimalFriendly
      );
      updateAnimalAttribute(
        "isCommandsTaught",
        editedBehaviorData.isCommandsTaught
      );
      updateAnimalAttribute(
        "isLeashTrained",
        editedBehaviorData.isLeashTrained
      );

      setAnimalData({
        ...animalData,
        isPeopleFriendly: editedBehaviorData.isPeopleFriendly,
        isAnimalFriendly: editedBehaviorData.isAnimalFriendly,
        isCommandsTaught: editedBehaviorData.isCommandsTaught,
        isLeashTrained: editedBehaviorData.isLeashTrained,
      });
      console.log("Behavior data updated:", editedBehaviorData);

      setIsEditingBehavior(false);
    } catch (error) {
      console.error("Error updating behavior data:", error);
    }
  };

  const handleCancelBehaviorChanges = () => {
    setIsEditingBehavior(false);
    setEditedBehaviorData({
      isPeopleFriendly: animalData?.isPeopleFriendly || false,
      isAnimalFriendly: animalData?.isAnimalFriendly || false,
      isCommandsTaught: animalData?.isCommandsTaught || false,
      isLeashTrained: animalData?.isLeashTrained || false,
    });
  };

  // Utility functions to convert numeric values to labels
  const getAnimalSize = (size) => {
    switch (size) {
      case 0:
        return "Small";
      case 1:
        return "Medium";
      case 2:
        return "Large";
      default:
        return "Unknown";
    }
  };

  const getAnimalSex = (sex) => {
    return sex === 0 ? "Male" : "Female";
  };

  const getHealthCondition = (health) => {
    switch (health) {
      case 0:
        return "Healthy";
      case 1:
        return "Minor Issues";
      case 2:
        return "Serious Issues";
      default:
        return "Unknown";
    }
  };

  const getSpecies = (species) => {
    return species === 0 ? "Dog" : "Cat";
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // If animal data is not available, display an error message
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
        {errorMessages.length > 0 && (
          <ErrorMessages errorData={errorMessages} />
        )}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative">
            <img
              src={animalData.photo}
              alt={animalData.name}
              className="w-full min-w-[300px] max-w-md h-[350px] object-cover rounded-xl border-2 border-black shadow-lg mb-4"
            />

            {isEditable && (
              <div className="absolute top-2 right-2 cursor-pointer bg-white rounded-xl p-1">
                {/* Update animal's photo */}
                <FileUploader
                  onUpload={async (uploadedUrl) => {
                    await updateAnimalAttribute("photo", uploadedUrl);
                    setAnimalData((prevData) => ({
                      ...prevData,
                      photo: uploadedUrl,
                    }));
                  }}
                  onStatusChange={(status) => {
                    if (status === "success") {
                    } else if (status === "error") {
                      console.error("File upload failed");
                    }
                  }}
                  buttonText=""
                  buttonClassName="w-8 h-8"
                  icon="/icons/upload_photo.png"
                  iconSize="w-8 h-8"
                  isButton={false}
                />
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex items-center">
              {isEditingGeneral ? (
                <input
                  type="text"
                  value={editedGeneralData.name}
                  onChange={(e) =>
                    setEditedGeneralData({
                      ...editedGeneralData,
                      name: e.target.value,
                    })
                  }
                  className="text-3xl font-bold mb-4 border-b-2 border-gray-300 focus:outline-none flex-grow"
                />
              ) : (
                <h2 className="text-3xl font-semibold flex items-center">
                  {animalData.name}
                </h2>
              )}

              {isEditable &&
                (isEditingGeneral ? (
                  <div className="flex space-x-2 ml-4">
                    <img
                      src="/icons/confirm.png"
                      alt="Save"
                      className="w-5 h-5 cursor-pointer"
                      onClick={handleSaveGeneralChanges}
                    />
                    <img
                      src="/icons/cancel.png"
                      alt="Cancel"
                      className="w-5 h-5 cursor-pointer"
                      onClick={handleCancelGeneralChanges}
                    />
                  </div>
                ) : (
                  <img
                    src="/icons/pen.png"
                    alt="Edit"
                    className="w-5 h-5 cursor-pointer ml-4"
                    onClick={handleEditGeneralToggle}
                  />
                ))}
            </div>

            {isEditingGeneral ? (
              <div className="flex flex-col gap-2 mb-4">
                <div>
                  <strong>Species:</strong>
                  <select
                    value={editedGeneralData.species}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        species: parseInt(e.target.value),
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value={0}>Dog</option>
                    <option value={1}>Cat</option>
                  </select>
                </div>

                <div>
                  <strong>Breed:</strong>
                  <input
                    type="text"
                    value={editedGeneralData.breed}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        breed: e.target.value,
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  />
                </div>

                <div>
                  <strong>Age:</strong>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={editedGeneralData.age}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        age: parseInt(e.target.value),
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  />
                </div>

                <div>
                  <strong>Sex:</strong>
                  <select
                    value={editedGeneralData.sex}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        sex: parseInt(e.target.value),
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value={0}>Male</option>
                    <option value={1}>Female</option>
                  </select>
                </div>

                <div>
                  <strong>Size:</strong>
                  <select
                    value={editedGeneralData.size}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        size: parseInt(e.target.value),
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value={0}>Small</option>
                    <option value={1}>Medium</option>
                    <option value={2}>Large</option>
                  </select>
                </div>

                <div>
                  <strong>Weight:</strong>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editedGeneralData.weight}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        weight: e.target.value,
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  />
                </div>

                <div>
                  <strong>Health conditions:</strong>
                  <select
                    value={editedGeneralData.health}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        health: parseInt(e.target.value),
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value={0}>Healthy</option>
                    <option value={1}>Minor Issues</option>
                    <option value={2}>Serious Issues</option>
                  </select>
                </div>

                <div>
                  <strong>Personality:</strong>
                  <input
                    type="text"
                    value={editedGeneralData.personality}
                    onChange={(e) =>
                      setEditedGeneralData({
                        ...editedGeneralData,
                        personality: e.target.value,
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                <p>
                  <strong>Species:</strong> {getSpecies(animalData.species)}
                </p>
                <p>
                  <strong>Breed:</strong> {animalData.breed}
                </p>
                <p>
                  <strong>Age:</strong> {animalData.age} years
                </p>
                <p>
                  <strong>Sex:</strong> {getAnimalSex(animalData.sex)}
                </p>
                <p>
                  <strong>Size:</strong> {getAnimalSize(animalData.size)}
                </p>
                <p>
                  <strong>Weight:</strong> {`${animalData.weight}`} kg
                </p>
                <p>
                  <strong>Health conditions:</strong>{" "}
                  {getHealthCondition(animalData.health)}
                </p>
                <p>
                  <strong>Personality:</strong> {animalData.personality}
                </p>
              </div>
            )}

            <div className="mt-4">
              <Link
                to={`/reservations?animalName=${encodeURIComponent(
                  animalData.name
                )}`}
              >
                <Button
                  text={`WALK WITH ${animalData.name.toUpperCase()}`}
                  variant="blue"
                  icon="/icons/walk_button_white.png"
                  iconPosition="right"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-4xl text-center font-black mb-4">
            STORY & DETAILED INFORMATION
          </h3>

          <div className="mb-6">
            <h4 className="text-xl font-semibold flex items-center">
              History
              {isEditable &&
                (isEditingHistory ? (
                  <>
                    <button
                      className="ml-2 text-green-500 hover:text-green-700"
                      onClick={handleSaveHistoryChanges}
                    >
                      <img
                        src="/icons/confirm.png"
                        alt="Save"
                        className="w-4 h-4 inline-block"
                      />
                    </button>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={handleCancelHistoryChanges}
                    >
                      <img
                        src="/icons/cancel.png"
                        alt="Cancel"
                        className="w-4 h-4 inline-block"
                      />
                    </button>
                  </>
                ) : (
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={handleEditHistoryToggle}
                  >
                    <img
                      src="/icons/pen.png"
                      alt="Edit"
                      className="w-4 h-4 inline-block"
                    />
                  </button>
                ))}
            </h4>
            {isEditingHistory ? (
              <textarea
                value={editedHistory ? editedHistory : animalData.history}
                onChange={(e) => setEditedHistory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-2"
              />
            ) : (
              <p>{editedHistory ? editedHistory : animalData.history}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <h4 className="text-xl font-semibold flex items-center">
                Health and medical data
              </h4>
              {isEditable &&
                (isEditingMedical ? (
                  <div className="flex space-x-2 ml-4">
                    <img
                      src="/icons/confirm.png"
                      alt="Save"
                      className="w-4 h-4 cursor-pointer"
                      onClick={handleSaveMedicalChanges}
                    />
                    <img
                      src="/icons/cancel.png"
                      alt="Cancel"
                      className="w-4 h-4 cursor-pointer"
                      onClick={handleCancelMedicalChanges}
                    />
                  </div>
                ) : (
                  <img
                    src="/icons/pen.png"
                    alt="Edit"
                    className="w-4 h-4 cursor-pointer ml-2"
                    onClick={handleEditMedicalToggle}
                  />
                ))}
            </div>

            {isEditingMedical ? (
              <ul className="list-disc list-inside">
                <li>
                  <strong>Last medical examination:</strong>{" "}
                  {toDateInputFormat(animalData.lastExamination) ||
                    "Not specified"}
                </li>
                <li>
                  <strong>Vaccinations:</strong>
                  <select
                    value={editedMedicalData.isVaccinated}
                    onChange={(e) =>
                      setEditedMedicalData({
                        ...editedMedicalData,
                        isVaccinated: e.target.value === "true",
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value="true">
                      All necessary vaccinations have been completed
                    </option>
                    <option value="false">Not vaccinated</option>
                  </select>
                </li>
                <li>
                  <strong>Sterilized:</strong>
                  <select
                    value={editedMedicalData.isSterilized}
                    onChange={(e) =>
                      setEditedMedicalData({
                        ...editedMedicalData,
                        isSterilized: e.target.value === "true",
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </li>
                <li>
                  <strong>Micro-chipped:</strong>
                  <select
                    value={editedMedicalData.isChipped}
                    onChange={(e) =>
                      setEditedMedicalData({
                        ...editedMedicalData,
                        isChipped: e.target.value === "true",
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </li>
              </ul>
            ) : (
              <ul className="list-disc list-inside">
                <li>
                  <strong>Last medical examination:</strong>{" "}
                  {toDateInputFormat(animalData.lastExamination)}
                </li>
                <li>
                  <strong>Vaccinations:</strong>{" "}
                  {animalData.isVaccinated
                    ? "All necessary vaccinations have been completed"
                    : "Not vaccinated"}
                </li>
                <li>
                  <strong>Sterilized:</strong>{" "}
                  {animalData.isSterilized ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Micro-chipped:</strong>{" "}
                  {animalData.isChipped ? "Yes" : "No"}
                </li>
              </ul>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold flex items-center">
              Behavior and training
              {isEditable &&
                (isEditingBehavior ? (
                  <>
                    <button
                      className="ml-2 text-green-500 hover:text-green-700"
                      onClick={handleSaveBehaviorChanges}
                    >
                      <img
                        src="/icons/confirm.png"
                        alt="Save"
                        className="w-4 h-4 inline-block"
                      />
                    </button>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={handleCancelBehaviorChanges}
                    >
                      <img
                        src="/icons/cancel.png"
                        alt="Cancel"
                        className="w-4 h-4 inline-block"
                      />
                    </button>
                  </>
                ) : (
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={handleEditBehaviorToggle}
                  >
                    <img
                      src="/icons/pen.png"
                      alt="Edit"
                      className="w-4 h-4 inline-block"
                    />
                  </button>
                ))}
            </h4>
            {isEditingBehavior ? (
              <ul className="list-disc list-inside">
                <li>
                  <strong>Compatibility with people:</strong>
                  <select
                    value={editedBehaviorData.isPeopleFriendly ? "Yes" : "No"}
                    onChange={(e) =>
                      setEditedBehaviorData({
                        ...editedBehaviorData,
                        isPeopleFriendly: e.target.value === "Yes",
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </li>
                <li>
                  <strong>Compatibility with other animals:</strong>
                  <select
                    value={editedBehaviorData.isAnimalFriendly ? "Yes" : "No"}
                    onChange={(e) =>
                      setEditedBehaviorData({
                        ...editedBehaviorData,
                        isAnimalFriendly: e.target.value === "Yes",
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </li>
                <li>
                  <strong>Knows basic commands:</strong>
                  <select
                    value={editedBehaviorData.isCommandsTaught ? "Yes" : "No"}
                    onChange={(e) =>
                      setEditedBehaviorData({
                        ...editedBehaviorData,
                        isCommandsTaught: e.target.value === "Yes",
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </li>
                <li>
                  <strong>Leash trained:</strong>
                  <select
                    value={editedBehaviorData.isLeashTrained ? "Yes" : "No"}
                    onChange={(e) =>
                      setEditedBehaviorData({
                        ...editedBehaviorData,
                        isLeashTrained: e.target.value === "Yes",
                      })
                    }
                    className="ml-2 border-b-2 border-gray-300 focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </li>
              </ul>
            ) : (
              <ul className="list-disc list-inside">
                <li>
                  <strong>Compatibility with people:</strong>{" "}
                  {animalData.isPeopleFriendly ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Compatibility with other animals:</strong>{" "}
                  {animalData.isAnimalFriendly ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Knows basic commands:</strong>{" "}
                  {animalData.isCommandsTaught ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Leash trained:</strong>{" "}
                  {animalData.isLeashTrained ? "Yes" : "No"}
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-4xl text-center font-black mb-8">
            OTHER ANIMALS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                id={animal.id}
                image={animal.photo}
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
