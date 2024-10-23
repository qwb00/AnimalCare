import React from 'react';
import Header from '../components/Header';
import HomeSlider from '../components/HomeSlider';
import AnimalCard from '../components/AnimalCard'; // Импорт компонента AnimalCard
import Button from '../components/Button';
import AchievementsSlider from '../components/AchievementsSlider';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom'; // Импортируем Link

function Home() {
    const animals = [
        {
          name: 'Lola',
          age: '2 years',
          breed: 'Shiba Inu',
          get image() {
            return `/animals/${this.name.toLowerCase()}.png`;
          }
        },
        {
          name: 'Peanut',
          age: '1 year',
          breed: 'Maine Coon',
          get image() {
            return `/animals/${this.name.toLowerCase()}.png`;
          }
        },
        {
          name: 'Kelly',
          age: '3 years',
          breed: 'Border Collie',
          get image() {
            return `/animals/${this.name.toLowerCase()}.png`;
          }
        }
      ];
      

  return (
    <div>
      {/* Блок с фоном на первом экране и Хедером внутри */}
      <div className="min-h-screen bg-light-blue flex flex-col relative">
        {/* Хедер */}
        <Header />

        {/* Центрированный контент */}
        <div className="flex flex-col items-center flex-grow">
          {/* Заголовок */}
          <h1 className="text-4xl font-black text-center mt-16 mb-16">WELCOME TO OUR TINY WORLD</h1>

          {/* Слайдер */}
          <HomeSlider />
        </div>

        {/* Стрелочка вниз */}
<div className="z-20 flex justify-center mb-6">
  <button
    onClick={() => document.getElementById('animals-section').scrollIntoView({ behavior: 'smooth' })}
    className="w-12 h-12 rounded-full border-2 border-black flex justify-center items-center bg-white transform transition-transform duration-300 ease-in-out hover:translate-y-2 hover:scale-105" // Анимация подпрыгивания и увеличения
  >
    <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>
</div>

      </div>

      {/* Секция с животными */}
      <div id="animals-section" className="bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">OUR ANIMALS</h2>

          {/* Карточки животных */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {animals.map((animal, index) => (
              <AnimalCard key={index} image={animal.image} name={animal.name} age={animal.age} breed={animal.breed} />
            ))}
          </div>

          {/* Кнопка для полного списка животных */}
      <div className="flex justify-center">
        <Link to="/animals">
          <Button
            text="FULL LIST OF ANIMALS"
            variant="blue"
            icon="/icons/full_list_of_animals_button.png"
            iconPosition="right"
          />
        </Link>
      </div>
        </div>
      </div>

      <h2 className="text-4xl font-black text-center mt-16 mb-12">ABOUT US</h2>
      <AchievementsSlider />

      {/* Секция Help */}
      <div className="w-full bg-white py-16">
        <h2 className="text-4xl font-black text-center mb-10">HOW YOU CAN HELP</h2>

        <div className="flex justify-around items-start flex-wrap max-w-[1024px] mx-auto">
          {/* Первая карточка и кнопка */}
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-auto border-2 border-black bg-white shadow-lg rounded-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold text-center m-4">BECOME A VOLUNTEER</h3>
              <div className="border-y-2 border-black">
                <img src="/home/help1.png" alt="Become a Volunteer" className="w-full h-[325px] object-cover" />
              </div>
              <p className="text-justify text-gray-600 m-4">Sign up online to become a volunteer at our shelter and help animals in need</p>
            </div>
            <Button 
              text="SIGN UP" 
              variant="blue" 
              icon="/icons/sign_up_button.png" 
              iconPosition="right" 
              className="w-[300px] mt-4" 
            />
          </div>

          {/* Вторая карточка и кнопка */}
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-auto border-2 border-black bg-white shadow-lg rounded-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold text-center m-4">FIND A FRIEND</h3>
              <div className="border-y-2 border-black">
                <img src="/home/help2.png" alt="Find a Friend" className="w-full h-[325px] object-cover" />
              </div>
              <p className="text-justify text-gray-600 m-4">Adopt an animal from our shelter to get a friend and provide him a loving home</p>
            </div>
            <Link to="/reservations">
            <Button 
              text="SCHEDULE A WALK" 
              variant="blue" 
              icon="/icons/walk_button_white.png" 
              iconPosition="right" 
              className="w-[300px] mt-4"
            />
            </Link>
          </div>

          {/* Третья карточка и кнопка */}
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-auto border-2 border-black bg-white shadow-lg rounded-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold text-center m-4">HELP FINANCIALLY</h3>
              <div className="border-y-2 border-black">
                <img src="/home/help3.png" alt="Help Financially" className="w-full h-[325px] object-cover" />
              </div>
              <p className="text-justify text-gray-600 m-4">Make an online donation to our shelter and help support animals in need</p>
            </div>
            <Button 
              text="DONATE" 
              variant="blue" 
              icon="/icons/donate_button.png" 
              iconPosition="right" 
              className="w-[300px] mt-4" 
            />
          </div>
        </div>
      </div>

      {/* Заголовок над футером */}
      <h2 className="text-4xl font-black text-center my-8">THANK YOU FOR YOUR TIME!</h2>

      {/* Футер */}
      <Footer />
    </div>
  );
}

export default Home;
