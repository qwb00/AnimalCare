import React, { useState } from 'react';
import { format, addDays, addHours, startOfWeek, endOfWeek, isToday, isBefore, isAfter, parse, differenceInHours, isEqual} from 'date-fns';
import Button from './Button'; // Импорт компонента Button

function Calendar({ selectedAnimal }) {
  const today = new Date();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Начало текущей недели
  const [currentWeek, setCurrentWeek] = useState(startOfThisWeek); // Текущая неделя
  const [selectedSlots, setSelectedSlots] = useState([]); // Храним выбранные интервалы
  const [isModalOpen, setIsModalOpen] = useState(false); // Управление модальным окном
  const MAX_SLOTS = 10; // Максимально допустимое количество слотов

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

    if (selectedSlots.includes(slotKey)) {
      // Убираем из выбранных, если уже выбран
      setSelectedSlots((prevSelected) => prevSelected.filter((s) => s !== slotKey));
    } else {
      // Проверяем, что выбранных слотов не больше MAX_SLOTS
      if (selectedSlots.length < MAX_SLOTS) {
        setSelectedSlots((prevSelected) => [...prevSelected, slotKey]);
      } else {
        alert(`You can select a maximum of ${MAX_SLOTS} slots.`);
      }
    }
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

// Функция для преобразования слота в интервал времени
const formatTimeSlot = (slot) => {
    const lastDashIndex = slot.lastIndexOf('-');
    const date = slot.substring(0, lastDashIndex); // Дата
    const startTime = slot.substring(lastDashIndex + 1).trim(); // Время
  
    // Парсим время начала слота
    const parsedStartTime = parse(`${date} ${startTime}`, 'yyyy-MM-dd hh:mm a', new Date());
    
    // Добавляем один час к времени начала, чтобы получить конец интервала
    const endTime = addHours(parsedStartTime, 1);
  
    // Форматируем дату и временной интервал
    const formattedDate = format(parsedStartTime, 'MMM dd yyyy');
    const formattedStartTime = format(parsedStartTime, 'hh:mm a');
    const formattedEndTime = format(endTime, 'hh:mm a');
  
    // Возвращаем объект с датой и интервалом времени
    return {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
  };

  // Функция для объединения соседних временных интервалов
const mergeTimeSlots = (selectedSlots) => {
    // Преобразуем слоты в объекты с датой и временем
    const slots = selectedSlots.map(formatTimeSlot);
  
    // Сгруппируем слоты по дате
    const groupedByDate = slots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {});
  
    // Объединяем соседние временные интервалы
    const mergedSlots = [];
  
    Object.keys(groupedByDate).forEach((date) => {
      const times = groupedByDate[date].sort((a, b) => {
        const parsedA = parse(`${date} ${a.startTime}`, 'MMM dd yyyy hh:mm a', new Date());
        const parsedB = parse(`${date} ${b.startTime}`, 'MMM dd yyyy hh:mm a', new Date());
        return parsedA - parsedB;
      });
  
      let currentStart = times[0].startTime;
      let currentEnd = times[0].endTime;
  
      for (let i = 1; i < times.length; i++) {
        const previousEnd = parse(`${date} ${currentEnd}`, 'MMM dd yyyy hh:mm a', new Date());
        const currentStartTime = parse(`${date} ${times[i].startTime}`, 'MMM dd yyyy hh:mm a', new Date());
  
        // Если текущий интервал начинается сразу после предыдущего
        if (differenceInHours(currentStartTime, previousEnd) === 0) {
          currentEnd = times[i].endTime; // Обновляем конец интервала
        } else {
          // Добавляем объединенный интервал и начинаем новый
          mergedSlots.push({ date, startTime: currentStart, endTime: currentEnd });
          currentStart = times[i].startTime;
          currentEnd = times[i].endTime;
        }
      }
  
      // Добавляем последний интервал для текущей даты
      mergedSlots.push({ date, startTime: currentStart, endTime: currentEnd });
    });
  
    return mergedSlots;
  };

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
              className={`flex flex-col items-center p-2 border border-gray-300 bg-white rounded-lg ${isCurrentDay ? 'text-red-500' : ''} min-h-[90px]`}
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
        {daysOfWeek.map((day) => {
          const isPastDay = isBefore(day, today) && !isToday(day); // Проверка, прошел ли день (и исключаем сегодняшний)
          
          return (
            <div key={day} className="flex flex-col items-center p-2 border border-gray-300 bg-white rounded-xl">
              {timeSlots.map((slot) => {
                const slotKey = `${format(day, 'yyyy-MM-dd')}-${slot}`; // Уникальный ключ для каждого слота
                const isSelected = selectedSlots.includes(slotKey); // Проверяем, выбран ли слот
                const isInactive = inactiveTimes.includes(slot) || isPastDay; // Проверяем, неактивный ли слот

                return (
                  <button
                    key={slot}
                    onClick={() => !isInactive && handleSlotClick(day, slot)} // Игнорируем клик по неактивным слотам
                    title={isInactive ? (isPastDay ? 'Past date' : 'Already reserved') : ''} // Всплывающий текст для неактивных ячеек
                    className={`px-4 py-2 mb-2 w-full rounded-2xl transition-all duration-200
                      ${isInactive ? '!bg-gray-300 text-gray-600 !border-gray-300 cursor-default' : ''}
                      ${isSelected ? 'bg-white text-black border border-black' : 'bg-main-blue text-white border border-main-blue'}
                      ${!isInactive ? 'hover:bg-white hover:text-black hover:border-black' : ''}
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>


      {/* Кнопка создания бронирования */}
      <div className="flex justify-center mt-4">
        <Button 
          text="Create Reservation" 
          variant="blue" 
          icon="/icons/plus_white.png" 
          iconPosition="left" 
          iconSize="h-4 w-4" // Установлен меньший размер иконки
          onClick={handleOpenModal}
        />
      </div>

      {/* Модальное окно подтверждения */}
        {isModalOpen && (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleCloseModal} // Закрытие модального окна по клику на затемненную область
        >
            <div 
            className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black"
            onClick={(e) => e.stopPropagation()} // Останавливаем клик внутри модального окна, чтобы не закрыть его
            >
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Confirm Your Reservation</h3>
            <div className="flex items-start">
                <div className="flex-1">
                <p className="text-lg mb-4 text-gray-700">Animal: <strong>{selectedAnimal}</strong></p>
                <p className="text-lg mb-4 text-gray-700">Selected Time Slots:</p>
                <div className="flex flex-col gap-2 mb-6">
                    {mergeTimeSlots(selectedSlots).map(({ date, startTime, endTime }) => (
                    <div key={`${date}-${startTime}-${endTime}`} className="bg-main-blue text-white px-4 py-2 rounded-lg shadow-sm text-sm">
                        {`${date}: ${startTime} - ${endTime}`}
                    </div>
                    ))}
                </div>
                </div>
                {/* Фото животного с черным бордером и закруглением */}
                <div className="flex-shrink-0 ml-4">
                <img src={animalImagePath} alt={selectedAnimal} className="w-36 h-36 object-cover rounded-xl border-2 border-black shadow-lg" />
                </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
                {/* Кнопка Cancel */}
                <Button 
                text="Cancel" 
                variant="white" 
                icon="/icons/cancel.png" 
                iconPosition="right" 
                className="px-5 py-2" 
                onClick={handleCloseModal} 
                />
                {/* Кнопка Confirm */}
                <Button 
                text="Confirm" 
                variant="blue" 
                icon="/icons/confirm_white.png" 
                iconPosition="right" 
                className="px-5 py-2" 
                onClick={handleCloseModal} 
                />
            </div>
            </div>
        </div>
        )}

    </div>
  );
}

export default Calendar;
    