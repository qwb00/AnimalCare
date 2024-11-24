import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import HomeSlider from "../components/HomeSlider";
import AnimalCard from "../components/AnimalCard";
import Button from "../components/Button";
import AchievementsSlider from "../components/AchievementsSlider";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function Home() {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const openDonateModal = () => setIsDonateModalOpen(true);
  const closeDonateModal = () => setIsDonateModalOpen(false);

  // Fetch animals from API and select 3 random animals
  const fetchAnimals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals`);
      const allAnimals = response.data;

      // Shuffle and select the first 3 animals
      const randomAnimals = allAnimals
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      setAnimals(randomAnimals);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching animals:", error);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return (
    <div>
      {/* Background section with header */}
      <div className="min-h-screen bg-light-blue flex flex-col relative z-10">
        <Header />

        {/* Centered content */}
        <div className="flex flex-col items-center flex-grow">
          {/* Heading */}
          <h1 className="text-4xl font-black text-center mt-16 mb-16">
            WELCOME TO OUR TINY WORLD
          </h1>
          <HomeSlider />
        </div>

        {/* Down arrow */}
        <div className="z-20 flex justify-center mb-6">
          <button
            onClick={() =>
              document
                .getElementById("animals-section")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="w-12 h-12 rounded-full border-2 border-black flex justify-center items-center bg-white transform transition-transform duration-300 ease-in-out hover:translate-y-2 hover:scale-105"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Animals section */}
      <div id="animals-section" className="bg-white p-8">
        <div className="max-w-[1024px] mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">OUR ANIMALS</h2>

          {/* Display loading message or animal cards */}
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {animals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  id={animal.id}
                  image={animal.photo}
                  name={animal.name}
                  age={`${animal.age} years`}
                  breed={animal.breed}
                />
              ))}
            </div>
          )}

          {/* Button for full list of animals */}
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

      {/* Help section */}
      <div className="w-full bg-white py-16">
        <h2 className="text-4xl font-black text-center mb-10">
          HOW YOU CAN HELP
        </h2>

        <div className="flex justify-around items-start flex-wrap max-w-[1024px] mx-auto">
          {/* Volunteer card and button */}
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-auto border-2 border-black bg-white shadow-lg rounded-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold text-center m-4">
                BECOME A VOLUNTEER
              </h3>
              <div className="border-y-2 border-black">
                <img
                  src="/home/help1.png"
                  alt="Become a Volunteer"
                  className="w-full h-[325px] object-cover"
                />
              </div>
              <p className="text-justify text-gray-600 m-4">
                Sign up online to become a volunteer at our shelter and help
                animals in need
              </p>
            </div>
            <Link to="/signup">
              <Button
                text="SIGN UP"
                variant="blue"
                icon="/icons/sign_up_button.png"
                iconPosition="right"
                className="w-[300px] mt-4"
              />
            </Link>
          </div>

          {/* Find a Friend card and button */}
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-auto border-2 border-black bg-white shadow-lg rounded-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold text-center m-4">
                FIND A FRIEND
              </h3>
              <div className="border-y-2 border-black">
                <img
                  src="/home/help2.png"
                  alt="Find a Friend"
                  className="w-full h-[325px] object-cover"
                />
              </div>
              <p className="text-justify text-gray-600 m-4">
                Adopt an animal from our shelter to get a friend and provide him
                a loving home
              </p>
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

          {/* Financial help card and button */}
          <div className="flex flex-col items-center">
            <div className="w-[300px] h-auto border-2 border-black bg-white shadow-lg rounded-lg flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold text-center m-4">
                HELP FINANCIALLY
              </h3>
              <div className="border-y-2 border-black">
                <img
                  src="/home/help3.png"
                  alt="Help Financially"
                  className="w-full h-[325px] object-cover"
                />
              </div>
              <p className="text-justify text-gray-600 m-4">
                Make an online donation to our shelter and help support animals
                in need
              </p>
            </div>
            <Button
              text="DONATE"
              variant="blue"
              icon="/icons/donate_button.png"
              iconPosition="right"
              className="w-[300px] mt-4"
              onClick={openDonateModal}
            />
          </div>
        </div>
      </div>

      {isDonateModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeDonateModal}
        >
          <div
            className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-semibold mb-6 text-center text-gray-900">
              Support Our Shelter
            </h3>
            <p className="text-gray-700 mb-8 text-center">
              Please consider supporting our project with full points!
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                text="Close"
                variant="blue"
                icon="/icons/cancel_white.png"
                iconPosition="right"
                className="px-5 py-2"
                onClick={closeDonateModal}
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-4xl font-black text-center my-8">
        THANK YOU FOR YOUR TIME!
      </h2>

      <Footer />
    </div>
  );
}

export default Home;
