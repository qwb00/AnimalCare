import React, { useState } from 'react';
import Header from '../components/Header'; // Импортируем компонент Header
import Search from '../components/Search'; // Импортируем компонент Search
import Calendar from '../components/Calendar';
import Footer from '../components/Footer'; // Импортируем компонент Footer

// Массив с животными для проверки
const availableAnimals = ['Lola', 'Peanut', 'Kelly'];

function Reservations() {
  const [selectedAnimal, setSelectedAnimal] = useState(null); // Храним выбранное животное

  const handleSearchResult = (result) => {
    // Обрабатываем результат поиска
    const match = result.match(/Animal "(.*)" is selected!/);
    if (match && availableAnimals.includes(match[1])) {
      setSelectedAnimal(match[1]); // Устанавливаем имя животного, если оно есть в массиве
    } else {
      setSelectedAnimal(null); // Сбрасываем, если животное не найдено
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Хедер */}
      <Header />

      {/* Основной контент */}
      <div className="flex flex-col items-start justify-center mt-16 w-full max-w-[1024px] mx-auto px-0">
        {/* Заголовок WALKING SCHEDULE */}
        <h1 className="text-4xl font-black text-center mb-8 w-full">WALKING SCHEDULE</h1>

        {/* Заголовок Weekly Schedule с иконкой */}
        <div className="flex items-center justify-start w-full mb-6">
          <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
          <img src="/icons/calendar_black.png" alt="Calendar icon" className="h-6 w-6 ml-2" />
        </div>

        {/* Поле поиска животного */}
        <div className="flex items-start justify-start w-full mb-8">
          <Search
            placeholder="Animal's name"
            icon="/icons/pen.png"
            onSearch={handleSearchResult}
          />
        </div>

        {/* Добавляем отступ для разделения результатов поиска и заголовка календаря */}
        {selectedAnimal ? (
          <div className="mt-12 w-full"> {/* Добавлен отступ */}
            <Calendar selectedAnimal={selectedAnimal} />
          </div>
        ) : (
          <p className="text-gray-600 mt-4">
            Please select an animal to see the schedule or make sure the name matches the available animals.
          </p>
        )}

        {/* Секция с правилами выгула животных */}
        <div className="mt-8 w-full">
          <h2 className="text-4xl font-black mb-6 text-center">10 RULES TO WALK ANIMALS</h2>
          <ol className="list-decimal list-inside space-y-4 text-justify">
            <li>
              <strong>Mandatory Training:</strong> All volunteers must complete a training session covering animal handling, safety protocols, and shelter policies before engaging in any activities.
            </li>
            <li>
              <strong>Punctuality:</strong> Arrive at least 10 minutes before your scheduled time to prepare.
            </li>
            <li>
              <strong>Leash and Harness Use:</strong> Use only shelter-provided leashes and harnesses. Ensure they are properly fitted before starting the walk.
            </li>
            <li>
              <strong>Constant Supervision:</strong> Never leave the animal unattended during the walk.
            </li>
            <li>
              <strong>No Off-Leash Activity:</strong> Animals must remain leashed at all times, regardless of the location.
            </li>
            <li>
              <strong>Other Animals:</strong> Keep a safe distance from other animals to prevent aggressive behavior or the spread of diseases.
            </li>
            <li>
              <strong>Designated Routes:</strong> Follow the shelter's approved walking paths and stay within the designated areas.
            </li>
            <li>
              <strong>Positive Reinforcement:</strong> Use gentle commands and reward good behavior with praise. Do not yell at or punish the animal.
            </li>
            <li>
              <strong>Incident Reporting:</strong> Immediately report any incidents such as bites, escapes, or injuries to shelter staff.
            </li>
            <li>
              <strong>Illness:</strong> Do not volunteer if you are feeling unwell, especially with symptoms that could affect the animals.
            </li>
          </ol>
        </div>
      </div>

      <h2 className="text-4xl font-black text-center my-8">THANK YOU FOR YOUR TIME!</h2>
      {/* Компонент Footer */}
      <Footer />
    </div>
  );
}

export default Reservations;
