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

    const handleChange = (event) => {
        const { name, value } = event.target || event;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target || event;
        setFormData((prev) => ({
            ...prev,
            dateRange: { ...prev.dateRange, [name]: value }
        }));
    };

    const handleFrequencyChange = (event) => {
        const { name, value } = event.target || event;
        setFormData((prev) => ({
            ...prev,
            frequency: { ...prev.frequency, [name]: Number(value) }
        }));
    };

    const handleFrequencyCountChange = (change) => {
        setFormData((prev) => ({
            ...prev,
            frequency: {
                ...prev.frequency,
                count: Math.max(1, prev.frequency.count + change)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Retrieve current caretaker's ID from sessionStorage
        const veterinarianId = sessionStorage.getItem('userID');
    
        // Prepare data to submit, including converting type to a numerical format
        const dataToSubmit = {
          ...formData,
          veterinarianId
        };
        console.log(dataToSubmit);
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
    const [animals, setAnimals] = useState([]);

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

    fetchAnimals();
  }, []);

  // Transform animals and veterinarians data to options for react-select
  const animalOptions = animals.map((animal) => ({
    value: animal.id,
    label: `${animal.name} (${animal.breed})`,
  }));


    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
                    Add New Prescription
                </h3>

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
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
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
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                            />
                            <input
                                name="endDate"
                                type="date"
                                value={formData.dateRange.endDate}
                                onChange={handleDateChange}
                                required
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
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
                                className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
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
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
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
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-2 mt-4">
                        <Button
                            text="Cancel"
                            variant="white"
                            icon="/icons/cancel.png"
                            iconSize="w-5 h-5"
                            iconPosition="right"
                            onClick={onClose}
                            className="px-5 py-2 text-sm"
                        />
                        <Button
                            text="Save"
                            variant="blue"
                            icon="/icons/confirm_white.png"
                            iconSize="w-5 h-5"
                            iconPosition="right"
                            className="px-5 py-2 text-sm"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPrescriptionForm;
