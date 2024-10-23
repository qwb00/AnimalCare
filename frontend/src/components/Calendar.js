import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isToday, isAfter } from 'date-fns';
import Button from './Button'; // Импорт компонента Button

function Calendar({ selectedAnimal }) {
  const today = new Date();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Начало текущей недели
  const [currentWeek, setCurrentWeek] = useState(startOfThisWeek); // Текущая неделя
  const [selectedSlots, setSelectedSlots] = useState([]); // Хранение выбранных интервалов
  const [isModalOpen, setIsModalOpen] = useState(false); // Управление модальным окном

  // Функция для переключения на следующую неделю
  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, 7));
  };

  // Функция для переключения на предыдущую неделю
  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, -7));
  };

  // Функция для выбора временного интервала
  const handleSlotClick = (day, slot) => {
    const slotKey = `${format(day, 'yyyy-MM-dd')}-${slot}`; // Уникальный ключ для каждого временного интервала
    setSelectedSlots((prevSelected) =>
      prevSelected.includes(slotKey)
        ? prevSelected.filter((s) => s !== slotKey) // Убираем из выбранных, если уже выбран
        : [...prevSelected, slotKey] // Добавляем в выбранные
    );
  };

  // Получаем дни недели для отображения
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    daysOfWeek.push(addDays(currentWeek, i));
  }

  // Временные слоты для каждого дня (с 9:00 до 17:00)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    const formattedTime = format(new Date(2022, 0, 1, hour), 'hh:mm a');
    return formattedTime;
  });

  // Стили для неактивных интервалов
  const inactiveTimes = ['11:00 AM', '03:00 PM'];

  // Функция для открытия модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Путь к изображению животного
  const animalImagePath = `/animals/${selectedAnimal}.png`;

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-4">
        {/* Заголовок с переключением недель */}
        <h2 className="text-xl font-semibold">
          Check <span className="text-main-blue">available</span> 1-hour slots for the walks with{' '}
          <span className="font-bold">{selectedAnimal}</span>:
        </h2>
        <div className="flex items-center bg-main-blue rounded-xl">
          {/* Кнопка влево пропадает, если мы находимся на текущей неделе */}
          {isAfter(currentWeek, startOfThisWeek) && (
            <button onClick={handlePrevWeek} className="text-white px-4 py-2">
              &lt;
            </button>
          )}

          {/* Фиксированная ширина для блока с датами */}
          <span className="text-white px-4 py-2" style={{ minWidth: '150px', textAlign: 'center' }}>
            {format(currentWeek, 'dd MMM')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd MMM')}
          </span>

          <button onClick={handleNextWeek} className="text-white px-4 py-2">
            &gt;
          </button>
        </div>
      </div>

      {/* Сетка для дней недели с серыми бордерами */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {daysOfWeek.map((day) => {
          const isCurrentDay = isToday(day); // Проверяем, является ли это сегодняшним днем
          return (
            <div
              key={day}
              className={`flex flex-col items-center p-2 border border-gray-300 rounded-lg ${isCurrentDay ? 'text-red-500' : ''} min-h-[90px]`}
            >
              {/* День недели */}
              <div className={`text-lg font-semibold ${isCurrentDay ? 'text-red-500' : ''}`}>
                {format(day, 'EEE')} {/* Отображаем день недели (Mon, Tue...) */}
              </div>

              {/* Дата с кружком */}
              <div
                className={`text-2xl font-bold ${isCurrentDay ? 'bg-main-blue text-white rounded-full w-10 h-10 flex items-center justify-center' : ''}`}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Места для записи времени (с 9:00 до 17:00) */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex flex-col items-center p-2 border border-gray-300 rounded-xl">
            {timeSlots.map((slot) => {
              const slotKey = `${format(day, 'yyyy-MM-dd')}-${slot}`; // Уникальный ключ для каждого слота
              const isSelected = selectedSlots.includes(slotKey); // Проверяем, выбран ли слот
              const isInactive = inactiveTimes.includes(slot); // Проверяем, неактивный ли слот

              return (
                <button
                  key={slot}
                  onClick={() => !isInactive && handleSlotClick(day, slot)} // Игнорируем клик по неактивным слотам
                  title={isInactive ? 'Already reserved' : ''} // Всплывающий текст для неактивных ячеек
                  className={`px-4 py-2 mb-2 w-full rounded-2xl transition-all duration-200
                    ${isInactive ? 'bg-gray-300 text-gray-600 !border-gray-300 cursor-default' : ''}
                    ${isSelected ? 'bg-white text-black border border-black' : 'bg-main-blue text-white border border-main-blue'}
                    ${!isInactive ? 'hover:bg-white hover:text-black hover:border-black' : ''}
                  `}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Кнопка создания бронирования */}
      <div className="flex justify-center mt-8">
        <Button 
          text="Create Reservation" 
          variant="blue" 
          icon="/icons/plus_white.png" 
          iconPosition="left" 
          onClick={handleOpenModal}
        />
      </div>

      {/* Модальное окно подтверждения */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Confirm Your Reservation</h3>
            <div className="flex">
              <div className="flex-1">
                <p className="text-lg mb-4 text-gray-700">Animal: <strong>{selectedAnimal}</strong></p>
                <p className="text-lg mb-4 text-gray-700">Selected Time Slots:</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedSlots.length > 0 ? (
                    selectedSlots.map((slot) => (
                      <div key={slot} className="bg-main-blue text-white px-3 py-1 rounded-full shadow-sm text-sm">
                        {slot}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No slots selected</p>
                  )}
                </div>
              </div>
              {/* Фото животного */}
              <div className="flex-shrink-0 ml-4">
                <img src={animalImagePath} alt={selectedAnimal} className="w-30 h-24 object-cover border border-black rounded-xl shadow-lg" />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-md bg-main-blue text-white hover:bg-blue-700 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
