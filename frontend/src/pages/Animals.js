  import React, { useEffect, useState } from 'react';
  import Header from '../components/Header';
  import Footer from '../components/Footer';
  import AnimalCard from '../components/AnimalCard';
  import axios, { all } from 'axios';
  import API_BASE_URL from '../config';
  import Button from '../components/Button'; // Импортируем кнопку Button
  import FileUploader from '../components/FileUploader';

  function Animals() {
    const [allAnimals, setAllAnimals] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Открытие/закрытие модального окна
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Открытие/закрытие модального уведомления
    const [notification, setNotification] = useState({ isSuccess: true, message: '' }); // Состояние уведомления
    const [photoUrl, setPhotoUrl] = useState(''); // Состояние для хранения URL фотографии
    const [userRole, setUserRole] = useState(''); // Состояние для роли пользователя
    const [visibleCount, setVisibleCount] = useState(6);

    const animalsPerPageForAdmin = 5; // Количество животных для администратора
    const animalsPerPageForUser = 6; // Количество животных для обычного пользователя
    const animalsPerPage = userRole === 'Caretaker' || userRole === 'Administrator' ? animalsPerPageForAdmin : animalsPerPageForUser;
    const totalPages = Math.ceil(allAnimals.length / animalsPerPage);

    const [currentPage, setCurrentPage] = useState(1); // Для отслеживания текущей страницы

    // Состояния для каждого инпута
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [size, setSize] = useState('');
    const [health, setHealth] = useState('');
    const [foundDate, setFoundDate] = useState('');
    const [personality, setPersonality] = useState('');
    const [history, setHistory] = useState('');

    // Функция загрузки всех животных с сервера
    const loadAllAnimals = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_BASE_URL}/animals`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = response.data;
        if (data && data.length > 0) {
          setAllAnimals(data);
        }
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      // Получаем роль пользователя из sessionStorage
      const storedUserRole = sessionStorage.getItem('role');
      setUserRole(storedUserRole);

      console.log('User role:', storedUserRole);
    
      // Загружаем всех животных при монтировании компонента
      loadAllAnimals();
    }, []);

    const showMoreAnimals = () => {
      setVisibleCount((prevCount) => prevCount + 6);
    };
    
    // Переключение на следующую страницу
    const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
    
    // Переключение на предыдущую страницу
    const handlePreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    // Индексы начала и конца текущей страницы
    const startIndex = (currentPage - 1) * animalsPerPage;
    const endIndex = startIndex + animalsPerPage;
      
    // Определяем список животных для отображения на текущей странице
    const currentAnimals = allAnimals.slice(startIndex, endIndex);

    // Определение номеров страниц для отображения
    const getPageNumbers = () => {
      const pages = [];
      const maxPageNumbers = 5; // Количество кнопок страниц, которые будут отображаться

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

    // Функция для перехода к указанной странице
    const goToPage = (page) => {
      if (page === "..." || page < 1 || page > totalPages) return;
      setCurrentPage(page);
    };
      
      
    // Открытие и закрытие модального окна
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    function generateGUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    


    // Функция для отправки данных на сервер
    // Обновление функции handleAddAnimal для проверки заполненности полей
    const handleAddAnimal = async () => {

      if (!name || !breed || !age || !species || !sex || !size || !health || !photoUrl) {
        setNotification({ message: 'Please fill all fields.', isSuccess: false });
        setIsNotificationOpen(true);
        return;
      }


      const newAnimalID = generateGUID();
    
      try {    
        // Формируем объект данных для отправки
          const animalData = {
            name: name,
            breed: breed,
            age: parseInt(age),
            photo: photoUrl,
            weight: "0 kg",
            sex: sex === "Male" ? 0 : 1,
            size: size === "Small" ? 0 : size === "Medium" ? 1 : size === "Large" ? 2 : 3,
            health: health === "Good" ? 0 : health === "Fair" ? 1 : 2,
            species: species === "Dog" ? 0 : 1,
            history: history,
            personality: personality,
            isVaccinated: true,
            isSterilized: true,
            isChipped: true,
            lastExamination: new Date().toISOString(),
            isPeopleFriendly: true,
            isAnimalFriendly: true,
            isCommandsTaught: true,
            isLeashTrained: true,
            dateFound: new Date(foundDate).toISOString(),
          };

        const authToken = sessionStorage.getItem('token');

        console.log('Animal data:', animalData);

        console.log('Photo URL:', photoUrl);

        console.log('Token data:', authToken);

        console.log('New animal ID:', newAnimalID);
    
        // Отправляем данные животного на сервер
        const response = await axios.post(`${API_BASE_URL}/animals`, animalData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log('Response:', response); 
    
        if (response.status === 200) {
          setNotification({ isSuccess: true, message: 'Animal added successfully!' });
          setIsNotificationOpen(true);
          handleCloseModal();
        }
      } catch (error) {
        console.error('Error adding animal:', error);
        setNotification({ isSuccess: false, message: 'Failed to add animal.' });
        setIsNotificationOpen(true);
      }
    };
    


    return (
      <div className="max-w-screen-lg mx-auto">
        <Header />

        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-black mt-8 mb-4">OUR ANIMALS</h1>
        </div>

        <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentAnimals.map((animal, index) => (
          <AnimalCard
            key={`${animal.id}-${index}`}
            id={animal.id}
            image={animal.photo}
            name={animal.name}
            age={`${animal.age} years`}
            breed={animal.breed}
          />
        ))}

        {userRole && (userRole === 'Caretaker' || userRole === 'Administrator') && (
          <div
            className="rounded-xl bg-main-blue h-[500px] flex flex-col justify-start items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={handleOpenModal}
          >
            <div className="text-center text-white text-3xl font-bold mt-20">New Animal</div>
            <div className="w-48 h-48 rounded-full border-8 border-white flex items-center justify-center mt-20">
              <img src="/icons/plus_white.png" alt="New" className="w-20 h-20" />
            </div>
          </div>
        )}
      </div>

      {/* Пагинация */}
<div className="flex justify-center space-x-3 my-6 mt-12">
  {currentPage > 1 && (
    <button
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-5 py-3 bg-main-blue text-white rounded-xl text-xl"
    >
      Previous
    </button>
  )}

  {/* Отображение номеров страниц */}
  {getPageNumbers().map((page, index) => (
    <button
      key={index}
      onClick={() => goToPage(page)}
      className={`px-5 py-3 rounded-xl text-xl ${page === currentPage ? 'bg-main-blue text-white' : 'bg-white border-black border text-black'} ${
        page === "..." ? "cursor-default" : "cursor-pointer"
      }`}
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

        {/* Модальное окно для добавления нового животного */}
        {isModalOpen && (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleCloseModal} // Закрытие модального окна по клику на затемненную область
    >
      <div 
        className="bg-white p-4 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black"
        onClick={(e) => {
          if (e) e.stopPropagation();
        }} // Останавливаем клик внутри модального окна, чтобы не закрыть его
      >
        <h3 className="text-xl font-bold mb text-center text-gray-800">ADD NEW ANIMAL</h3>
        
        <button 
          type="button" 
          className="absolute top-3 right-3 bg-main-blue rounded-full p-2" 
          aria-label="Close" 
          style={{ transform: 'rotate(45deg)' }}
          onClick={handleCloseModal} 
        >
            <img src="/icons/plus_white.png" alt="Close" className="w-3 h-3" />
        </button>

        {/* Инпут Name */}
        <div className="mb-1">
          <label className="block text-gray-700 mb-1 font-medium text-xs">Name</label>
          <input
            type="text"
            placeholder="Enter animal’s name"
            className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Выпадающий список Species */}
        <div className="mb-1 relative">
          <label className="block text-gray-700 mb-1 font-medium text-xs">Species</label>
          <div className="relative">
            <select
              className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              required
            >
              <option value="">Select species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>
        </div>

        {/* Инпут Breed */}
        <div className="mb-1">
          <label className="block text-gray-700 mb-1 font-medium text-xs">Breed</label>
          <input
            type="text"
            placeholder="Enter animal’s breed"
            className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-xs"
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </div>

        {/* Поля Age и Sex в одной строке */}
        <div className="flex gap-2 mb-1">
          {/* Инпут Age */}
          <div className="flex-1">
            <label className="block text-gray-700 mb-1 font-medium text-xs">Age</label>
            <input
              type="number"
              placeholder="Enter animal’s age"
              min="0"
              max="25"
              className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-xs"
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {/* Выпадающий список Sex */}
          <div className="flex-1 relative">
            <label className="block text-gray-700 mb-1 font-medium text-xs">Sex</label>
            <select
              className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              required
            </select>
          </div>
        </div>

        {/* Поля Size и Health Conditions в одной строке */}
        <div className="flex gap-2 mb-1">
          {/* Выпадающий список Size */}
          <div className="flex-1 relative">
            <label className="block text-gray-700 mb-1 font-medium text-xs">Size</label>
            <select
              className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            >
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="ExtraLarge">ExtraLarge</option>
            </select>
          </div>

          {/* Выпадающий список Health Conditions */}
          <div className="flex-1 relative">
            <label className="block text-gray-700 mb-1 font-medium text-xs">Health Conditions</label>
            <select
              className="w-full p-1.5 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
              value={health}
              onChange={(e) => setHealth(e.target.value)}
              required
            >
              <option value="">Select health conditions</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>

        {/* Поле Found date */}
        <div className="mb-1">
          <label className="block text-gray-700 mb-1 font-medium text-xs">Found date</label>
          <input
            type="date"
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
            placeholder="Enter when animal was found"
            value={foundDate}
            onChange={(e) => setFoundDate(e.target.value)}
            required
          />
        </div>

        {/* Поле Personality */}
        <div className="mb-1">
          <label className="block text-gray-700 mb-1 font-medium text-xs">Personality</label>
          <input
            type="text"
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
            placeholder="Enter animal’s personality"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            required
          />
        </div>

        {/* Текстареа History */}
        <div className="mb-2 relative">
          <label className="block text-gray-700 mb-1 font-medium text-xs">History</label>
          <textarea
            maxLength="2000"
            className="w-full p-1.5 h-12 max-h-16 min-h-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue focus:appearance-none text-xs"
            placeholder="Write history of animal"
            rows="4"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Кнопка Upload photo */}
        <div className="mb-2">
        <FileUploader
    onUpload={(uploadedUrl) => setPhotoUrl(uploadedUrl)}
    onStatusChange={(status) => {
        if (status === 'success') {
            console.log('File uploaded successfully');
        } else if (status === 'error') {
            console.log('File upload failed');
        }
    }}
    buttonText="Upload Photo"
    buttonClassName="h-10 w-36 border border-gray-300 rounded-md text-sm"
    icon="/icons/upload_photo.png"
    iconSize="w-5 h-5"
    isButton={true} // Указываем, что это полноценная кнопка
/>

        </div>

        <div className="flex justify-center space-x-2 mt-4">
          {/* Кнопка Cancel */}
          <Button 
          text="Cancel" 
          variant="white" 
          iconSize="w-5 h-5"
          icon="/icons/cancel.png" 
          iconPosition="right" 
          className="px-5 py-2 text-sm" 
          onClick={handleCloseModal} 
          />
          {/* Кнопка Confirm */}
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
      onClick={() => setIsNotificationOpen(false)} // Закрываем модальное окно по клику
    >
      <div
        className={`bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 ${
          notification.isSuccess ? 'border-green-600' : 'border-red-600'
        }`}
        onClick={(e) => e.stopPropagation()} // Останавливаем клик внутри модального окна, чтобы не закрыть его
      >
        <h3
          className={`text-2xl font-bold mb-6 text-center ${
            notification.isSuccess ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {notification.isSuccess ? 'Success!' : 'Error'}
        </h3>
        <p className="text-lg mb-6 text-center text-gray-800">{notification.message}</p>
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
