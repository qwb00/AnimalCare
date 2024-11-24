import React, { useState, useEffect, useRef } from "react";

function AchievementsSlider() {
  const [activeSlide, setActiveSlide] = useState(0); 
  const intervalRef = useRef(null); 

  const achievements = [
    {
      image: "/home/slider1.png",
      title: "Ranked #1 in Animal Care Quality in the Czech Republic",
      description:
        "Our shelter is proud to be recognized as the leading institution for animal care in the Czech Republic...",
    },
    {
      image: "/home/slider2.png",
      title: "Top-3 in Fastest Rehoming Times—Average of 7 Days",
      description:
        "We understand that finding a loving home quickly is essential for an animal's well-being...",
    },
    {
      image: "/home/slider3.png",
      title: "95% Adoption Success Rate with Happy Forever Homes",
      description:
        "Our commitment doesn't end at adoption; we strive for lifelong happiness for both the animals and their new families...",
    },
    {
      image: "/home/slider4.png",
      title: "Over 100 Animals Rescued and Rehomed Annually",
      description:
        "Every year, we rescue and rehome over 100 animals, giving them a second chance at a happy life...",
    },
    {
      image: "/home/slider5.png",
      title: "Certified Eco-Friendly Shelter Committed to Sustainability",
      description:
        "Sustainability is at the heart of our operations. As a certified eco-friendly shelter, we incorporate green practices...",
    },
  ];

  // Automatically switch slides every 5 seconds
  useEffect(() => {
    startSliderInterval(); 

    return () => clearInterval(intervalRef.current);
  }, [achievements.length]);

  // Function to start the interval
  const startSliderInterval = () => {
    clearInterval(intervalRef.current); // Reset previous interval
    intervalRef.current = setInterval(() => {
      setActiveSlide((prevSlide) =>
        prevSlide === achievements.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // 5-second interval
  };

  // Manual slide control with timer reset
  const goToPreviousSlide = () => {
    setActiveSlide((prevSlide) =>
      prevSlide === 0 ? achievements.length - 1 : prevSlide - 1
    );
    startSliderInterval(); // Restart timer
  };

  const goToNextSlide = () => {
    setActiveSlide((prevSlide) =>
      prevSlide === achievements.length - 1 ? 0 : prevSlide + 1
    );
    startSliderInterval(); 
  };

  // Function to get previous and next slide images for previews
  const getPrevImage = () => {
    return activeSlide === 0
      ? achievements[achievements.length - 1].image
      : achievements[activeSlide - 1].image;
  };

  const getNextImage = () => {
    return activeSlide === achievements.length - 1
      ? achievements[0].image
      : achievements[activeSlide + 1].image;
  };

  // Function to navigate to a specific slide by index
  const goToSlide = (index) => {
    setActiveSlide(index);
    startSliderInterval(); // Restart timer on manual transition
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      {/* Background blurred image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-lg z-10"
        style={{ backgroundImage: `url(${achievements[activeSlide].image})` }}
      ></div>

      {/* Container for card and control panel */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        {/* Card */}
        <div className="relative bg-white shadow-lg rounded-lg flex flex-col h-auto w-[640px] mb-8">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                activeSlide === index
                  ? "opacity-100 relative"
                  : "opacity-0 hidden"
              }`}
            >
              <div className="w-[640px] h-[360px] border-4 border-white rounded-t-lg">
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              {/* Text content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-center mb-2">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 text-justify">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Slider control panel */}
        <div className="flex justify-between items-center w-full max-w-[640px]">
          {/* Left arrow with SVG */}
          <button
            onClick={goToPreviousSlide}
            className="text-white h-14 bg-transparent p-2 rounded-lg"
          >
            <img
              src="/icons/left_arrow.svg"
              alt="Left Arrow"
              className="h-full"
            />
          </button>

          {/* Image previews (enlarged with rounded corners and white border) */}
          <img
            src={getPrevImage()}
            alt="Previous slide"
            className="w-20 h-14 object-cover border border-white rounded-lg opacity-75 cursor-pointer mx-2"
            onClick={() =>
              goToSlide(
                activeSlide === 0 ? achievements.length - 1 : activeSlide - 1
              )
            }
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
            onClick={() =>
              goToSlide(
                activeSlide === achievements.length - 1 ? 0 : activeSlide + 1
              )
            }
          />

          {/* Right arrow with SVG */}
          <button
            onClick={goToNextSlide}
            className="text-white h-14 bg-transparent p-2 rounded-lg"
          >
            <img
              src="/icons/right_arrow.svg"
              alt="Right Arrow"
              className="h-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AchievementsSlider;
