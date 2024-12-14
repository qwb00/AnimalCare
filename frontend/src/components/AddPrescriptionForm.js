// Aleksander Postelga xposte00

/*
* Form for adding a new prescription to the system
*/

import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import Button from './Button';
import Select from 'react-select';
import {  toast } from 'react-toastify';
import ErrorMessages from '../components/ErrorMessages';

function AddPrescriptionForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        animalId: '',
        drug: '',
        dateRange: {
            startDate: '',
            endDate: ''
        },
        frequency: {
            count: 1,
            unit: 0
        },
        description: '',
        diagnosis: '',
    });
    const [errorData, setErrorData] = useState(null);

    // Update specific parts of formData without overwriting the entire state
    const handleChange = (event) => {
        const { name, value } = event.target || event;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle changes for nested dateRange structure
    const handleDateChange = (event) => {
        const { name, value } = event.target || event;
        setFormData((prev) => ({
            ...prev,
            dateRange: { ...prev.dateRange, [name]: value }
        }));
    };

    // Update frequency object while ensuring numeric transformation of the value
    const handleFrequencyChange = (event) => {
        const { name, value } = event.target || event;
        setFormData((prev) => ({
            ...prev,
            frequency: { ...prev.frequency, [name]: Number(value) }
        }));
    };

    // Increment or decrement frequency count
    const handleFrequencyCountChange = (change) => {
        setFormData((prev) => ({
            ...prev,
            frequency: {
                ...prev.frequency,
                count: Math.max(1, prev.frequency.count + change)
            }
        }));
    };

    // Submit form data to the API
    const handleSubmit = async (e) => {
        e.preventDefault();
        const veterinarianId = sessionStorage.getItem('userID');
    
        const dataToSubmit = {
          ...formData,
          veterinarianId
        };
        try {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/medications`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSubmit),
    
          });
    
          if (!response.ok) {
            const errorResponse = await response.json();
            setErrorData(errorResponse);
            return;
          }
          onClose(); // Close modal after successful submission
          toast.success('Request created successfully', {
            autoClose: 3000,
            hideProgressBar: true,
          });
        } catch (error) {
          console.error("Error submitting request:", error);
          toast.error('Error submitting request'); // Notify user of network or unexpected errors
        }
      };
    const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/animals`); // Fetch animal data from API
        const data = await response.json();
        setAnimals(data); // Populate select options with API data
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchAnimals(); // Load animals when the component mounts
  }, []);

  // Transform animals and veterinarians data to options for react-select
  const animalOptions = animals.map((animal) => ({
    value: animal.id,
    label: `${animal.name} (${animal.breed})`,
  }));


    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose} // Clicking outside the modal closes it
        >
            <div
                className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black relative"
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner clicks
            >
                <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
                    Add New Prescription
                </h3>

                {/* Close button for the modal */}
                <button
                    type="button"
                    className="absolute top-3 right-3 bg-main-blue rounded-full p-2"
                    aria-label="Close"
                    style={{ transform: "rotate(45deg)" }}
                    onClick={onClose}
                >
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
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    borderColor: state.isFocused ? '#4BD4FF' : base.borderColor, // main-blue
                                    boxShadow: state.isFocused ? '0 0 0 1px #4BD4FF' : base.boxShadow,
                                    '&:hover': {
                                        borderColor: '#4BD4FF', // hover color
                                    },
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? '#CBF2FF' : base.backgroundColor, // animals hover
                                    color: state.isFocused ? '#000' : base.color,
                                }),
                            }}
                            required
                        />
                    </div>

                    {/* Medication */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1 font-medium text-sm">
                            Medication
                        </label>
                        <input
                            name="drug"
                            type="text"
                            placeholder="Enter medication"
                            value={formData.drug}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue text-sm"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1 font-medium text-sm">
                            Date Range
                        </label>
                        <div className="flex space-x-2">
                            <input
                                name="startDate"
                                type="date"
                                value={formData.dateRange.startDate}
                                onChange={handleDateChange}
                                required
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue text-sm"
                            />
                            <input
                                name="endDate"
                                type="date"
                                value={formData.dateRange.endDate}
                                onChange={handleDateChange}
                                required
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue text-sm"
                            />
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1 font-medium text-sm">
                            Frequency
                        </label>
                        <div className="flex items-center space-x-2">
                            {/* Numeric stepper */}
                            <button
                                type="button"
                                className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                onClick={() => handleFrequencyCountChange(-1)}
                            >
                                -
                            </button>
                            <span className="text-lg font-bold">{formData.frequency.count}</span>
                            <button
                                type="button"
                                className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                onClick={() => handleFrequencyCountChange(1)}
                            >
                                +
                            </button>
                            <span>per</span>
                            {/* Unit selector */}
                            <select
                                name="unit"
                                value={formData.frequency.unit}
                                onChange={handleFrequencyChange}
                                required
                                className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-main-blue text-sm"
                            >
                                <option value="0">Day</option>
                                <option value="1">Week</option>
                                <option value="2">Month</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1 font-medium text-sm">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue text-sm"
                        />
                    </div>

                    {/* Diagnosis */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1 font-medium text-sm">
                            Diagnosis
                        </label>
                        <input
                            name="diagnosis"
                            type="text"
                            placeholder="Enter diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue text-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-2 mt-4">
                        <Button
                            text="Cancel"
                            variant="red"
                            icon="/icons/cancel_white.png"
                            iconSize="w-5 h-5"
                            onClick={onClose}
                            className="px-5 py-2 text-sm w-full mr-6"
                        />
                        <Button
                            text="Save"
                            variant="blue"
                            icon="/icons/confirm_white.png"
                            iconSize="w-5 h-5"
                            className="px-5 py-2 text-sm w-full"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPrescriptionForm;
