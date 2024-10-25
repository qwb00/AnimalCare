import React, { useState, useEffect, useRef } from 'react';

function AchievementsSlider() {
  const [activeSlide, setActiveSlide] = useState(0); // Управление текущим слайдом
  const intervalRef = useRef(null); // Храним ссылку на интервал

  const achievements = [
    {
      image: '/home/slider1.png',
      title: 'Ranked #1 in Animal Care Quality in the Czech Republic',
      description: 'Our shelter is proud to be recognized as the leading institution for animal care in the Czech Republic. We achieve this through our state-of-the-art facilities, experienced veterinary staff, and personalized care plans for each animal. From the moment an animal arrives, we ensure they receive the best medical attention, nutrition, and emotional support. This top ranking reflects our unwavering commitment to the well-being and happiness of every creature under our roof.'
    },
    {
      image: '/home/slider2.png',
      title: 'Top-3 in Fastest Rehoming Times—Average of 7 Days',
      description: 'We understand that finding a loving home quickly is essential for an animal\'s well-being. That\'s why we\'ve streamlined our adoption processes to minimize the time animals spend in the shelter. With an average rehoming time of just 7 days, we\'re among the top three shelters in the country for speedy adoptions. Our dedicated team works tirelessly to match each animal with the perfect family, ensuring a smooth transition into their new lives.'
    },
    {
      image: '/home/slider3.png',
      title: '95% Adoption Success Rate with Happy Forever Homes',
      description: 'Our commitment doesn\'t end at adoption; we strive for lifelong happiness for both the animals and their new families. With a 95% adoption success rate, we have one of the highest retention rates in the industry. We provide post-adoption support, resources, and follow-ups to ensure a perfect match. This success reflects our thorough screening process and the strong bonds we help create between pets and owners.'
    },
    {
      image: '/home/slider4.png',
      title: 'Over 100 Animals Rescued and Rehomed Annually',
      description: 'Every year, we rescue and rehome over 100 animals, giving them a second chance at a happy life. Our rescue efforts span from urban areas to the most remote parts of the country, ensuring no animal is left behind. Through community outreach and partnerships, we expand our impact and raise awareness about animal welfare. This milestone is a testament to our dedication and the collective effort of our volunteers and supporters.'
    },
    {
      image: '/home/slider5.png',
      title: 'Certified Eco-Friendly Shelter Committed to Sustainability',
      description: 'Sustainability is at the heart of our operations. As a certified eco-friendly shelter, we incorporate green practices in everything we do—from using renewable energy sources to implementing comprehensive recycling programs. Our facilities are designed to minimize environmental impact while maximizing comfort for the animals. We believe in protecting our planet as passionately as we care for our furry friends, ensuring a better future for all.'
    }
  ];

  // Автоматическое переключение слайдов каждые 5 секунд
  useEffect(() => {
    startSliderInterval(); // Запуск слайдера при монтировании

    return () => clearInterval(intervalRef.current); // Очищаем интервал при размонтировании
  }, [achievements.length]);

  // Функция для запуска интервала
  const startSliderInterval = () => {
    clearInterval(intervalRef.current); // Сбрасываем предыдущий интервал
    intervalRef.current = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide === achievements.length - 1 ? 0 : prevSlide + 1));
    }, 5000); // Интервал 5 секунд
  };

  // Управление слайдами вручную с перезапуском таймера
  const goToPreviousSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide === 0 ? achievements.length - 1 : prevSlide - 1));
    startSliderInterval(); // Перезапуск таймера
  };

  const goToNextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide === achievements.length - 1 ? 0 : prevSlide + 1));
    startSliderInterval(); // Перезапуск таймера
  };

  // Функция для получения изображений для превью
  const getPrevImage = () => {
    return activeSlide === 0 ? achievements[achievements.length - 1].image : achievements[activeSlide - 1].image;
  };

  const getNextImage = () => {
    return activeSlide === achievements.length - 1 ? achievements[0].image : achievements[activeSlide + 1].image;
  };

  // Функция для перехода к слайду по индексу
  const goToSlide = (index) => {
    setActiveSlide(index);
    startSliderInterval(); // Перезапуск таймера при ручном переходе
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      {/* Фоновая заблюренная картинка */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-lg z-10"
        style={{ backgroundImage: `url(${achievements[activeSlide].image})` }}
      ></div>

      {/* Общий контейнер для карточки и панели управления */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        {/* Карточка */}
        <div className="relative bg-white shadow-lg rounded-lg flex flex-col h-auto w-[640px] mb-8"> {/* Изменен отступ на mb-8 */}
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                activeSlide === index ? 'opacity-100 relative' : 'opacity-0 hidden'
              }`}
            >
              <div className="w-[640px] h-[360px] border-4 border-white rounded-t-lg">
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              {/* Текстовый контент */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-center mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 text-justify">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Панель управления слайдером */}
        <div className="flex justify-between items-center w-full max-w-[640px]">
          {/* Стрелка влево с SVG */}
          <button
            onClick={goToPreviousSlide}
            className="text-white h-14 bg-transparent p-2 rounded-lg"
          >
            <img src="/icons/left_arrow.svg" alt="Left Arrow" className="h-full" />
          </button>

          {/* Превью картинок (увеличены, с закруглением и белой границей) */}
          <img
            src={getPrevImage()}
            alt="Previous slide"
            className="w-20 h-14 object-cover border border-white rounded-lg opacity-75 cursor-pointer mx-2"
            onClick={() => goToSlide(activeSlide === 0 ? achievements.length - 1 : activeSlide - 1)}
          />
          <img
            src={achievements[activeSlide].image}
            alt="Current slide"
            className="w-20 h-14 object-cover border-2 border-white rounded-lg cursor-pointer mx-2"
            onClick={() => goToSlide(activeSlide)}
          />
          <img
            src={getNextImage()}
            alt="Next slide"
            className="w-20 h-14 object-cover border border-white rounded-lg opacity-75 cursor-pointer mx-2"
            onClick={() => goToSlide(activeSlide === achievements.length - 1 ? 0 : activeSlide + 1)}
          />

          {/* Стрелка вправо с SVG */}
          <button
            onClick={goToNextSlide}
            className="text-white h-14 bg-transparent p-2 rounded-lg"
          >
            <img src="/icons/right_arrow.svg" alt="Right Arrow" className="h-full" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AchievementsSlider;
