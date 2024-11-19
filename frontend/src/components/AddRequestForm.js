import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AddRequestForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        animalId: '',
        veterinarianId: '',
        examinationDate: '',
        type: '',
        description: '',
    });
    
    const [animals, setAnimals] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);
    
    // Effect to fetch animals and veterinarians when the component is rendering
    useEffect(() => {
        //function to get list of animals
        const fetchAnimals = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/animals`);
                const data = await response.json();
                setAnimals(data);
            } catch (error) {
                console.error("Error fetching animals:", error);
            }
        };
        
        // get veterinarians list
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

    // Handle form input changes and update formData state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Retrieve current caretaker's ID from sessionStorage
        const careTakerId = sessionStorage.getItem('userID');
        
        // Prepare data to submit, including converting type to a numerical format
        const dataToSubmit = {
            ...formData,
            careTakerId,
            type: formData.type === 'Planned treatment' ? 0 : 1,
            status: 0 
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

            if (!response.ok) {
                throw new Error('Failed to create new request');
            }

            alert('Request created successfully');
            onClose(); // Close the form upon successful submission
        } catch (error) {
            console.error("Error submitting request:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">New Request</h2>
                
                {/* Animal Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Animal</label>
                    <select
                        name="animalId"
                        value={formData.animalId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select an animal</option>
                        {animals.map((animal) => (
                            <option key={animal.id} value={animal.id}>
                                {animal.name} ({animal.breed})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Veterinarian Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Veterinarian</label>
                    <select
                        name="veterinarianId"
                        value={formData.veterinarianId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select a veterinarian</option>
                        {veterinarians.map((vet) => (
                            <option key={vet.id} value={vet.id}>
                                {vet.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Examination Date Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Examination Date</label>
                    <input
                        type="date"
                        name="examinationDate"
                        value={formData.examinationDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Type Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select type</option>
                        <option value="Planned treatment">Planned treatment</option>
                        <option value="Emergency treatment">Emergency treatment</option>
                    </select>
                </div>

                {/* Description Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Type description here"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-600 mr-4"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRequestForm;