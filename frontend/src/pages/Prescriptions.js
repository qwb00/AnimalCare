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
            try {
                const response = await axios.get(`${API_BASE_URL}/medications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                });
                console.log(response.data); // Log available animals
                setPrescriptions(response.data); // Save the list of animals with name and ID
            } catch (error) {
                console.error("Error fetching animals:", error);
            }
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
