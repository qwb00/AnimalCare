import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link из React Router

function AnimalCard({ id, image, name, age, breed }) {
  return (
    <Link to={`/animals/${id}`} className="block"> {/* Оборачиваем карточку в Link */}
      <div className="border-2 h-[500px] border-black rounded-2xl overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
        {/* Верхняя часть с фото */}
        <div className="border-b-2 border-black h-64 overflow-hidden"> {/* Фиксированная высота */}
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Имя животного */}
        <h3 className="text-2xl font-bold text-center mt-4">{name}</h3>

        {/* Блок с описанием */}
        <div className="p-6 pb-4">
          <div className="flex items-start mb-4">
            <img src="/icons/age.png" alt="Age icon" className="h-8 w-8 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Age</h4>
              <p className="text-lg text-gray-600">{age}</p>
            </div>
          </div>

          <div className="flex items-start mb-4">
            <img src="/icons/breed.png" alt="Breed icon" className="h-8 w-8 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Breed</h4>
              <p className="text-lg text-gray-600">{breed}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default AnimalCard;
