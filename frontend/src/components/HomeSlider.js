import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

function HomeSlider() {
  const [activeSlide, setActiveSlide] = useState(0); // 0 for the first slide, 1 for the second

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide === 0 ? 1 : 0)); // Toggle slides
    }, 5000); // 5-second interval

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* First slide */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeSlide === 0
            ? "opacity-100 z-10"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-start w-full max-w-[1024px] mx-auto">
          <div className="w-1/2 flex flex-col justify-start">
            <p className="text-2xl font-normal mb-10">
              Help us give love and care to our little friends — reserve a time
              to take one of our furry friends for a walk!
            </p>
            <div className="mt-6">
              <Link to="/reservations">
                <Button
                  text="WALK AN ANIMAL"
                  variant="white"
                  icon="/icons/walk_button_black.png"
                  iconPosition="right"
                />
              </Link>
            </div>
          </div>
          <div className="w-1/2 flex justify-center items-start">
            <img src="/home/main_frame_dog.png" alt="Dog" className="h-96" />
          </div>
        </div>
      </div>

      {/* Second slide */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeSlide === 1
            ? "opacity-100 z-10"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-start w-full max-w-[1024px] mx-auto">
          {/* Image on the left */}
          <div className="w-1/2 flex justify-center items-start">
            <img
              src="/home/main_frame_cat.png"
              alt="Cat"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text and button on the right */}
          <div className="w-1/2 flex flex-col justify-start items-end text-right">
            <p className="text-2xl font-normal mb-10">
              Join our dedicated team and make a meaningful impact on the lives
              of our little friends!
            </p>
            <Link to="/signup" className="mt-6">
              <Button
                text="BECOME A VOLUNTEER"
                variant="white"
                icon="/icons/volunteer_button.png"
                iconPosition="left"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSlider;
