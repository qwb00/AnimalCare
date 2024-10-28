import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import AnimalCard from '../components/AnimalCard'; // Импорт компонента AnimalCard для отображения животных
import FileUploader from '../components/FileUploader';

function AnimalDetails() {
  const { animalID } = useParams(); // Получаем ID из URL
  const [animalData, setAnimalData] = useState(null);
  const [otherAnimals, setOtherAnimals] = useState([]); // Храним 3 случайных животных
  const [isLoading, setIsLoading] = useState(true);
  const [showFileUploader, setShowFileUploader] = useState(false);

  const authToken = sessionStorage.getItem('token');

  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [editedGeneralData, setEditedGeneralData] = useState({
    name: animalData?.name || "Unknown",
    species: animalData?.species === "Dog" ? 0 : 1,
    breed: animalData?.breed || "Undetermined",
    age: animalData?.age || 0,  
    sex: animalData?.sex === "Male" ? 0 : 1,
    size: animalData?.size === "Small" ? 0 : animalData?.size === "Medium" ? 1 : animalData?.size === "Large" ? 2 : 3,
    weight: animalData?.weight || 0,
    health: animalData?.health === "Good" ? 0 : animalData?.health === "Fair" ? 1 : 2,
    personality: animalData?.personality || "Undetermined",
  });

  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [editedHistory, setEditedHistory] = useState(animalData?.history || '');

  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [editedMedicalData, setEditedMedicalData] = useState({
    lastExamination: animalData?.lastExamination || '',
    isVaccinated: animalData?.isVaccinated,
    isSterilized: animalData?.isSterilized,
    isChipped: animalData?.isChipped,
  });

  const [isEditingBehavior, setIsEditingBehavior] = useState(false);
  const [editedBehaviorData, setEditedBehaviorData] = useState({
    isPeopleFriendly: animalData?.isPeopleFriendly,
    isAnimalFriendly: animalData?.isAnimalFriendly,
    isCommandsTaught: animalData?.isCommandsTaught,
    isLeashTrained: animalData?.isLeashTrained,
  });

  // Проверка роли пользователя
  const userRole = sessionStorage.getItem('role');
  const isEditable = userRole === 'Caretaker' || userRole === 'Administrator';

  console.log('User role:', userRole);
  console.log('Is editable:', isEditable);

  // Функция для получения данных о животном
  const fetchAnimalDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals/${animalID}`);
      setAnimalData(response.data);

    } catch (error) {
      console.error('Error fetching animal details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для получения 3 случайных животных
  const fetchOtherAnimals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals`);
      const allAnimals = response.data.filter((animal) => animal.id !== animalID);
      
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
  }, [animalID]);

  async function updateAnimalAttribute(path, value) {
    console.log(`Updating ${path} with value:`, value);

    try {
        const response = await axios.patch(
            `${API_BASE_URL}/animals/${animalID}`,
            [
                {
                    "op": "replace",
                    "path": `/${path}`,
                    "value": value,
                },
            ],
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json-patch+json',
                },
            }
        );

        return response;
    } catch (error) {
        console.error(`Error updating ${path}:`, error);
    }
}

  

  // Функция для переключения режима редактирования
  const handleEditGeneralToggle = () => {
    setIsEditingGeneral(true);
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

  // Функция для сохранения изменений на сервере
  const handleSaveGeneralChanges = async () => {
    try {

      updateAnimalAttribute("name", editedGeneralData.name);
      updateAnimalAttribute("species", editedGeneralData.species);
      updateAnimalAttribute("breed", editedGeneralData.breed);
      updateAnimalAttribute("age", editedGeneralData.age);
      updateAnimalAttribute("sex", editedGeneralData.sex);
      updateAnimalAttribute("size", editedGeneralData.size);
      updateAnimalAttribute("weight", editedGeneralData.weight);
      updateAnimalAttribute("health", editedGeneralData.health);
      updateAnimalAttribute("personality", editedGeneralData.personality);
  
      setAnimalData({
        ...animalData,
        name: editedGeneralData.name,
        species: editedGeneralData.species,
        breed: editedGeneralData.breed,
        age: editedGeneralData.age,
        sex: editedGeneralData.sex,
        size: editedGeneralData.size,
        weight: editedGeneralData.weight,
        health: editedGeneralData.health,
        personality: editedGeneralData.personality,
      });
      console.log('General info updated:', editedGeneralData);

      setIsEditingGeneral(false);
    } catch (error) {
      console.error('Error updating general info:', error);
    }
  };

  // Функция для отмены изменений
  const handleCancelGeneralChanges = () => {
    setEditedGeneralData(animalData); // Сбрасываем изменения
    setIsEditingGeneral(false); // Выходим из режима редактирования
  };

  const handleEditHistoryToggle = () => {
    setIsEditingHistory(!isEditingHistory);
    // Если отменяем редактирование, сбрасываем изменения
    if (isEditingHistory) {
      setEditedHistory(animalData?.history || '');
    }
  };
  
  const handleSaveHistoryChanges = async () => {
    try {

      updateAnimalAttribute("history", editedHistory);
  
      setAnimalData({
        ...animalData,
        history: editedHistory,
      });
      console.log('History updated:', editedHistory);

      setIsEditingHistory(false);
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };
  
  const handleCancelHistoryChanges = () => {
    // Отменяем изменения и сбрасываем состояние
    setIsEditingHistory(false);
    //setEditedHistory(animalData?.history || '');
  };
  
  const toDateInputFormat = (dateString) => {
    return dateString ? dateString.split("T")[0] : "";
  };



  const handleEditMedicalToggle = () => {
    setIsEditingMedical(true);
    setEditedMedicalData({
      lastExamination: animalData?.lastExamination,
      isVaccinated: animalData?.isVaccinated,
      isSterilized: animalData?.isSterilized,
      isChipped: animalData?.isChipped,
    });
  };
  
  const handleSaveMedicalChanges = async () => {
    try {

      console.log('Edited medical data:', editedMedicalData);

      updateAnimalAttribute("lastExamination", editedMedicalData.lastExamination);
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
      console.log('Medical data updated:', editedMedicalData);

      setIsEditingMedical(false);
    } catch (error) {
      console.error('Error updating medical data:', error);
    }
  };
  
  const handleCancelMedicalChanges = () => {
    // Отменяем изменения и сбрасываем состояние
    setIsEditingMedical(false);
    setEditedMedicalData({
      lastExamination: animalData?.lastExamination || '',
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

    console.log('Edited behavior data:', editedBehaviorData);

    updateAnimalAttribute("isPeopleFriendly", editedBehaviorData.isPeopleFriendly);
    updateAnimalAttribute("isAnimalFriendly", editedBehaviorData.isAnimalFriendly);
    updateAnimalAttribute("isCommandsTaught", editedBehaviorData.isCommandsTaught);
    updateAnimalAttribute("isLeashTrained", editedBehaviorData.isLeashTrained);

    setAnimalData({
      ...animalData,
      isPeopleFriendly: editedBehaviorData.isPeopleFriendly,
      isAnimalFriendly: editedBehaviorData.isAnimalFriendly,
      isCommandsTaught: editedBehaviorData.isCommandsTaught,
      isLeashTrained: editedBehaviorData.isLeashTrained,
    });
    console.log('Behavior data updated:', editedBehaviorData);

    setIsEditingBehavior(false);

    } catch (error) {
      console.error('Error updating behavior data:', error);
    }
  };
  
  const handleCancelBehaviorChanges = () => {
    // Отменяем изменения и сбрасываем состояние
    setIsEditingBehavior(false);
    setEditedBehaviorData({
      isPeopleFriendly: animalData?.isPeopleFriendly || false,
      isAnimalFriendly: animalData?.isAnimalFriendly || false,
      isCommandsTaught: animalData?.isCommandsTaught || false,
      isLeashTrained: animalData?.isLeashTrained || false,
    });
  };
  
  

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
          <div className="relative">
            <img 
              src={animalData.photo} 
              alt={animalData.name} 
              className="w-full max-w-md h-[350px] object-cover rounded-xl border-2 border-black shadow-lg mb-4" 
            />

            {/* Иконка для загрузки фото */}
            {isEditable && (
              <div className="absolute top-2 right-2 cursor-pointer bg-white rounded-xl p-1">
                <img 
                  src="/icons/upload_photo.png" 
                  alt="Upload"
                  className="w-8 h-8"
                  onClick={() => setShowFileUploader(!showFileUploader)} 
                />
              </div>
            )}

            {/* Компонент FileUploader для загрузки фото */}
            {showFileUploader && (
              <FileUploader 
                onUpload={async (uploadedUrl) => {
                  await updateAnimalAttribute("photo", uploadedUrl); // Обновляем фото на сервере
                  setAnimalData((prevData) => ({ ...prevData, photo: uploadedUrl })); // Обновляем локально
                  setShowFileUploader(false); // Закрываем загрузчик
                }}
              />
            )}
          </div>



















          {/* Секция с основной информацией */}
<div className="w-full md:w-1/2">
  <div className="flex items-center">
    {isEditingGeneral ? (
      <input
        type="text"
        value={editedGeneralData.name}
        onChange={(e) => setEditedGeneralData({ ...editedGeneralData, name: e.target.value })}
        className="text-3xl font-bold mb-4 border-b-2 border-gray-300 focus:outline-none flex-grow"
      />
    ) : (
      <h2 className="text-3xl font-semibold flex items-center">{animalData.name}</h2>
    )}

    {/* Иконки для редактирования */}
    {isEditable && (
      isEditingGeneral ? (
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
      )
    )}
  </div>

  {/* Поля для редактирования значений в секции */}
  {isEditingGeneral ? (
    <div className="flex flex-col gap-2 mb-4">
      <div>
        <strong>Species:</strong>
        <select
          value={editedGeneralData.species}
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, species: parseInt(e.target.value) })}
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
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, breed: e.target.value })}
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
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, age: parseInt(e.target.value) })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        />
      </div>

      <div>
        <strong>Sex:</strong>
        <select
          value={editedGeneralData.sex}
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, sex: parseInt(e.target.value) })}
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
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, size: parseInt(e.target.value) })}
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
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, weight: e.target.value })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        />
      </div>

      <div>
        <strong>Health conditions:</strong>
        <select
          value={editedGeneralData.health}
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, health: parseInt(e.target.value) })}
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
          onChange={(e) => setEditedGeneralData({ ...editedGeneralData, personality: e.target.value })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 mb-4">
      <p><strong>Species:</strong> {getSpecies(animalData.species)}</p>
      <p><strong>Breed:</strong> {animalData.breed}</p>
      <p><strong>Age:</strong> {animalData.age} years</p>
      <p><strong>Sex:</strong> {getAnimalSex(animalData.sex)}</p>
      <p><strong>Size:</strong> {getAnimalSize(animalData.size)}</p>
      <p><strong>Weight:</strong> {`${animalData.weight} kg`}</p>
      <p><strong>Health conditions:</strong> {getHealthCondition(animalData.health)}</p>
      <p><strong>Personality:</strong> {animalData.personality}</p>
    </div>
  )}

  {/* Кнопка для прогулок с животным */}
  <div className="mt-4">
    <Link to="/reservations">
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












        

        {/* Секция с историей и дополнительной информацией */}
        <div className="mt-8">
          <h3 className="text-4xl text-center font-black mb-4">STORY & DETAILED INFORMATION</h3>
          
          {/* История */}
<div className="mb-6">
  <h4 className="text-xl font-semibold flex items-center">
    History
    {isEditable && (
      isEditingHistory ? (
        <>
          <button
            className="ml-2 text-green-500 hover:text-green-700"
            onClick={handleSaveHistoryChanges}
          >
            <img src="/icons/confirm.png" alt="Save" className="w-4 h-4 inline-block" />
          </button>
          <button
            className="ml-2 text-red-500 hover:text-red-700"
            onClick={handleCancelHistoryChanges}
          >
            <img src="/icons/cancel.png" alt="Cancel" className="w-4 h-4 inline-block" />
          </button>
        </>
      ) : (
        <button
          className="ml-2 text-gray-500 hover:text-gray-700"
          onClick={handleEditHistoryToggle}
        >
          <img src="/icons/pen.png" alt="Edit" className="w-4 h-4 inline-block" />
        </button>
      )
    )}

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



























          {/* Медицинские данные */}
<div className="mb-6">
  <div className="flex items-center">
    <h4 className="text-xl font-semibold flex items-center">Health and medical data</h4>
    {/* Иконки для редактирования */}
    {isEditable && (
      isEditingMedical ? (
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
      )
    )}

  </div>

  {/* Поля для редактирования значений в медицинской секции */}
  {isEditingMedical ? (
    <ul className="list-disc list-inside">
      <li>
        <strong>Last medical examination:</strong>
        <input
          type="date"
          value={toDateInputFormat(editedMedicalData.lastExamination) || toDateInputFormat(animalData.lastExamination)}
          onChange={(e) => setEditedMedicalData({ ...editedMedicalData, lastExamination: e.target.value })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        />
      </li>
      <li>
        <strong>Vaccinations:</strong>
        <select
          value={editedMedicalData.isVaccinated}
          onChange={(e) => setEditedMedicalData({ ...editedMedicalData, isVaccinated: e.target.value === 'true' })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        >
          <option value="true">All necessary vaccinations have been completed</option>
          <option value="false">Not vaccinated</option>
        </select>
      </li>
      <li>
        <strong>Sterilized:</strong>
        <select
          value={editedMedicalData.isSterilized}
          onChange={(e) => setEditedMedicalData({ ...editedMedicalData, isSterilized: e.target.value === 'true' })}
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
          onChange={(e) => setEditedMedicalData({ ...editedMedicalData, isChipped: e.target.value === 'true' })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </li>
    </ul>
  ) : (
    <ul className="list-disc list-inside">
      <li><strong>Last medical examination:</strong> {toDateInputFormat(animalData.lastExamination)}</li>
      <li><strong>Vaccinations:</strong> {animalData.isVaccinated ? 'All necessary vaccinations have been completed' : 'Not vaccinated'}</li>
      <li><strong>Sterilized:</strong> {animalData.isSterilized ? 'Yes' : 'No'}</li>
      <li><strong>Micro-chipped:</strong> {animalData.isChipped ? 'Yes' : 'No'}</li>
    </ul>
  )}
</div>


















          {/* Секция с поведением и обучением */}
<div className="mb-6">
  <h4 className="text-xl font-semibold flex items-center">
    Behavior and training
    {isEditable && (
      isEditingBehavior ? (
        <>
          <button
            className="ml-2 text-green-500 hover:text-green-700"
            onClick={handleSaveBehaviorChanges}
          >
            <img src="/icons/confirm.png" alt="Save" className="w-4 h-4 inline-block" />
          </button>
          <button
            className="ml-2 text-red-500 hover:text-red-700"
            onClick={handleCancelBehaviorChanges}
          >
            <img src="/icons/cancel.png" alt="Cancel" className="w-4 h-4 inline-block" />
          </button>
        </>
      ) : (
        <button
          className="ml-2 text-gray-500 hover:text-gray-700"
          onClick={handleEditBehaviorToggle}
        >
          <img src="/icons/pen.png" alt="Edit" className="w-4 h-4 inline-block" />
        </button>
      )
    )}
  </h4>
  {isEditingBehavior ? (
    <ul className="list-disc list-inside">
      <li>
        <strong>Compatibility with people:</strong>
        <select
          value={editedBehaviorData.isPeopleFriendly ? 'Yes' : 'No'}
          onChange={(e) => setEditedBehaviorData({
            ...editedBehaviorData,
            isPeopleFriendly: e.target.value === 'Yes',
          })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </li>
      <li>
        <strong>Compatibility with other animals:</strong>
        <select
          value={editedBehaviorData.isAnimalFriendly ? 'Yes' : 'No'}
          onChange={(e) => setEditedBehaviorData({
            ...editedBehaviorData,
            isAnimalFriendly: e.target.value === 'Yes',
          })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </li>
      <li>
        <strong>Knows basic commands:</strong>
        <select
          value={editedBehaviorData.isCommandsTaught ? 'Yes' : 'No'}
          onChange={(e) => setEditedBehaviorData({
            ...editedBehaviorData,
            isCommandsTaught: e.target.value === 'Yes',
          })}
          className="ml-2 border-b-2 border-gray-300 focus:outline-none"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </li>
      <li>
        <strong>Leash trained:</strong>
        <select
          value={editedBehaviorData.isLeashTrained ? 'Yes' : 'No'}
          onChange={(e) => setEditedBehaviorData({
            ...editedBehaviorData,
            isLeashTrained: e.target.value === 'Yes',
          })}
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
        <strong>Compatibility with people:</strong> {animalData.isPeopleFriendly ? 'Yes' : 'No'}
      </li>
      <li>
        <strong>Compatibility with other animals:</strong> {animalData.isAnimalFriendly ? 'Yes' : 'No'}
      </li>
      <li>
        <strong>Knows basic commands:</strong> {animalData.isCommandsTaught ? 'Yes' : 'No'}
      </li>
      <li>
        <strong>Leash trained:</strong> {animalData.isLeashTrained ? 'Yes' : 'No'}
      </li>
    </ul>
  )}
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
