import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import Header from '../components/Header';
import PrescriptionsCalendar from '../components/PrescriptionsCalendar';
import Button from '../components/Button';
import PrescriptionCard from '../components/PrescriptionCard';
import AddPrescriptionForm from '../components/AddPrescriptionForm';
import API_BASE_URL from '../config';

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [showAddPrescriptionForm, setShowAddPrescriptionForm] = useState(false);
    const navigate = useNavigate();

    // Роль пользователя берется из sessionStorage
    const userRole = sessionStorage.getItem('role') || 'Caretaker'; // По умолчанию для тестов

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPrescriptions = async () => {
            // Mock data для тестирования; заменить на API-запрос
            const mockPrescriptions = [
                {
                    id: 1,
                    animalName: "Lola",
                    medication: "Paracetamol",
                    photo: "/images/lola.jpg",
                    dateRange: { startDate: "2024-11-01", endDate: "2024-11-30" },
                    frequency: { count: 2, unit: "day" },
                },
                {
                    id: 2,
                    animalName: "Max",
                    medication: "Ibuprofen",
                    photo: "/images/max.jpg",
                    dateRange: { startDate: "2024-11-05", endDate: "2024-11-10" },
                    frequency: { count: 1, unit: "day" },
                },
                {
                    id: 3,
                    animalName: "Bella",
                    medication: "Antibiotics",
                    photo: "/images/bella.jpg",
                    dateRange: { startDate: "2024-11-10", endDate: "2024-11-20" },
                    frequency: { count: 1, unit: "week" },
                },
            ];
            setPrescriptions(mockPrescriptions);
        };

        fetchPrescriptions();
    }, [navigate]);

    const handleAddPrescriptionClick = () => {
        setShowAddPrescriptionForm(true);
    };

    const handleFormSubmit = (formData) => {
        setPrescriptions(prevPrescriptions => [...prevPrescriptions, formData]);
        setShowAddPrescriptionForm(false);
    };

    return (
        <div className="container mx-auto max-w-[1024px]">
            <Header />
            <UserHeader user={{ name: "John Doe", role: userRole }} />
            <UserNav role={userRole} />

            {userRole === 'Veterinarian' && (
                <>
                    <div className="mb-8">
                        <Button text="+ New Prescription" variant="blue" onClick={handleAddPrescriptionClick} />
                    </div>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-black">Active Prescriptions</h2>
                    </div>
                    <div className="flex flex-wrap gap-10">
                        {prescriptions.map((prescription) => (
                            <PrescriptionCard
                                key={prescription.id}
                                prescription={prescription}
                            />
                        ))}
                    </div>
                </>
            )}

            {userRole === 'Caretaker' && (
                <PrescriptionsCalendar prescriptions={prescriptions} />
            )}

            {showAddPrescriptionForm && (
                <AddPrescriptionForm onSubmit={handleFormSubmit} onClose={() => setShowAddPrescriptionForm(false)} />
            )}
        </div>
    );
}

export default Prescriptions;
