import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AddRequestForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        animalName: '',
        veterinarianName: '',
        type: '',
        description: '',
        status: '',
        finalDiagnosis: ''
    });
    
    const [animals, setAnimals] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);
    
    useEffect(() => {
        // Функция для получения списка животных из API
        const fetchAnimals = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/animals`);
                const data = await response.json();
                setAnimals(data);
            } catch (error) {
                console.error("Error fetching animals:", error);
            }
        };
        
        // Функция для получения списка ветеринаров из API
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">New Request</h2>
                
                {/* Animal Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Animal</label>
                    <select
                        name="animalName"
                        value={formData.animalName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select an animal</option>
                        {animals.map((animal) => (
                            <option key={animal.id} value={animal.name}>
                                {animal.name} ({animal.breed})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Veterinarian Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Veterinarian</label>
                    <select
                        name="veterinarianName"
                        value={formData.veterinarianName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select a veterinarian</option>
                        {veterinarians.map((vet) => (
                            <option key={vet.id} value={vet.name}>
                                {vet.name}
                            </option>
                        ))}
                    </select>
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

                {/* Status Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select status</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Final Diagnosis Field */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Final Diagnosis</label>
                    <input
                        type="text"
                        name="finalDiagnosis"
                        value={formData.finalDiagnosis}
                        onChange={handleChange}
                        placeholder="Enter final diagnosis"
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

