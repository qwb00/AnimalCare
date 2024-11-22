import React, { useState } from 'react';
import Button from './Button';

function AddPrescriptionForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        animalName: '',
        drug: '',
        dateRange: {
            startDate: '',
            endDate: ''
        },
        frequency: {
            count: 1,
            unit: 'day'
        },
        description: '',
        diagnosis: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            dateRange: { ...prev.dateRange, [name]: value }
        }));
    };

    const handleFrequencyChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            frequency: { ...prev.frequency, [name]: value }
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

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

                <form onSubmit={handleSubmit}>
                    {/* Animal Name */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1 font-medium text-sm">
                            Animal Name
                        </label>
                        <input
                            name="animalName"
                            type="text"
                            placeholder="Enter animal name"
                            value={formData.animalName}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                        />
                    </div>

                    {/* Medication */}
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1 font-medium text-sm">
                            Medication
                        </label>
                        <input
                            name="medication"
                            type="text"
                            placeholder="Enter medication"
                            value={formData.medication}
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
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="year">Year</option>
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
                            required
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
                            required
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
