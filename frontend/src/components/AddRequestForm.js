/*
* Mikhail Vorobev xvorob01
* Form Component for adding medical treatment
*/

import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import Button from "../components/Button";
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enUS from 'date-fns/locale/en-US';
import Select from 'react-select';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorMessages from '../components/ErrorMessages';

registerLocale('en-US', enUS);

const AddRequestForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    animalId: '',
    veterinarianId: '',
    examinationDate: '',
    type: '',
    description: '',
  });
  const [errorData, setErrorData] = useState(null);

  const [animals, setAnimals] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);

  // Effect to fetch animals and veterinarians when the component is rendering
  useEffect(() => {
    // Function to get list of animals
    const fetchAnimals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/animals`);
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    // Get veterinarians list
    const fetchVeterinarians = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const veterinarians = data.filter(user => user.role === "Veterinarian");
        setVeterinarians(veterinarians);
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
      }
    };

    fetchAnimals();
    fetchVeterinarians();
  }, []);

  // Transform animals and veterinarians data to options for react-select
  const animalOptions = animals.map((animal) => ({
    value: animal.id,
    label: `${animal.name} (${animal.breed})`,
  }));

  const veterinarianOptions = veterinarians.map((vet) => ({
    value: vet.id,
    label: vet.name,
  }));

  // Handle form input changes and update formData state
  const handleChange = (event) => {
    const { name, value } = event.target || event;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const typeMapping = {
    'Planned treatment': 0,
    'Emergency treatment': 1,
    'Vaccination': 2,
    'Surgery': 3,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve current caretaker's ID from sessionStorage
    const careTakerId = sessionStorage.getItem('userID');

    // Prepare data to submit, including converting type to a numerical format
    const dataToSubmit = {
      ...formData,
      careTakerId,
      type: typeMapping[formData.type] ?? null,
    };

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/examinations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit),

      });

      console.log('Data to submit:', dataToSubmit);

      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorData(errorResponse);
        return;
      }
      onClose(); 
      toast.success('Request created successfully', {
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error('Error submitting request');
    }
  };

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black relative"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
          NEW REQUEST
        </h3>

        <button
          type="button"
          className="absolute top-3 right-3 bg-main-blue rounded-full p-2"
          aria-label="Close"
          style={{ transform: "rotate(45deg)" }}
          onClick={onClose}>
          <img
            src="/icons/plus_white.png"
            alt="Close"
            className="w-3 h-3"
          />
        </button>

        {errorData && <ErrorMessages errorData={errorData} />}

        <form onSubmit={handleSubmit}>
          {/* Animal */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 font-medium text-sm">
              Animal
            </label>
            <Select
              name="animalId"
              value={animalOptions.find(option => option.value === formData.animalId)}
              options={animalOptions}
              onChange={(selectedOption) =>
                handleChange({ name: 'animalId', value: selectedOption.value })
              }
              placeholder="Select an animal"
              className="text-sm"
              required
            />
          </div>

          {/* Veterinarian */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 font-medium text-sm">
              Veterinarian
            </label>
            <Select
              name="veterinarianId"
              value={veterinarianOptions.find(option => option.value === formData.veterinarianId)}
              options={veterinarianOptions}
              onChange={(selectedOption) =>
                handleChange({ name: 'veterinarianId', value: selectedOption.value })
              }
              placeholder="Select a veterinarian"
              className="text-sm"
              required
            />
          </div>

          {/* Examination Date */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 font-medium text-sm">
              Examination Date
            </label>
            <DatePicker
              selected={formData.examinationDate}
              onChange={(date) =>
                handleChange({ name: 'examinationDate', value: date })
              }
              dateFormat="MM/dd/yyyy"
              locale="en-US"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
              wrapperClassName="w-full"
              placeholderText="Select a date"
              required
            />
          </div>

          {/* Type */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-1 font-medium text-sm">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Planned treatment">Planned treatment</option>
              <option value="Emergency treatment">Emergency treatment</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Surgery"> Surgery</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-1 font-medium text-sm">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Type description here"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-2 mt-4">
            <Button
              text="Cancel"
              variant="white"
              iconSize="w-5 h-5"
              icon="/icons/cancel.png"
              iconPosition="right"
              className="px-5 py-2 text-sm"
              onClick={onClose}
            />
            <Button
              text="Add"
              variant="blue"
              iconSize="w-5 h-5"
              icon="/icons/confirm_white.png"
              iconPosition="right"
              className="px-5 py-2 text-sm"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddRequestForm;
