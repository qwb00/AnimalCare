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
    const [user, setUser] = useState(null); // Stores logged-in user data
    const [prescriptions, setPrescriptions] = useState([]);
    const [showAddPrescriptionForm, setShowAddPrescriptionForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to fetch user information');

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/medications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPrescriptions(response.data);
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            }
        };

        fetchUser();
        fetchPrescriptions();
    }, [navigate]);

    const handleAddPrescriptionClick = () => {
        setShowAddPrescriptionForm(true);
    };

    const handleFormSubmit = (formData) => {
        setPrescriptions(prevPrescriptions => [...prevPrescriptions, formData]);
        setShowAddPrescriptionForm(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <UserHeader user={user} />
            <UserNav role={user.role} />

            <div className="w-full max-w-[1024px] mx-auto mb-14">
                {user.role === 'Veterinarian' && (
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

                {user.role === 'Caretaker' && (
                    <PrescriptionsCalendar prescriptions={prescriptions} />
                )}

                {showAddPrescriptionForm && (
                    <AddPrescriptionForm onSubmit={handleFormSubmit} onClose={() => setShowAddPrescriptionForm(false)} />
                )}
            </div>
        </div>
    );
}

export default Prescriptions;
