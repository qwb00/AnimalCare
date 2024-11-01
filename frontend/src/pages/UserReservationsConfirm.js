import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import UserReservationCard from "../components/UserReservationCard";

function UserReservationsConfirm() {
    const [user, setUser] = useState(null);
    const [newRequests, setNewRequests] = useState([]);
    const [plannedWalks, setPlannedWalks] = useState([]);
    const [displayCountRequests, setDisplayCountRequests] = useState(2);
    const [displayCountPlanned, setDisplayCountPlanned] = useState(2);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch user information');
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        const fetchReservations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/reservations`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch reservations');
                const data = await response.json();

                setNewRequests(data.filter(reservation => reservation.isApproved === false));
                setPlannedWalks(data.filter(reservation => reservation.isApproved === true));
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchUser();
        fetchReservations();
    }, [navigate]);

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify([
                    {
                        "op": "replace",
                        "path": "/isApproved",
                        "value": true
                    }
                ])
            });

            if (!response.ok) throw new Error(`Failed to approve reservation: ${await response.text()}`);

            // Update the UI
            setNewRequests(prev => prev.filter(reservation => reservation.id !== id));
            setPlannedWalks(prev => [
                ...prev,
                { ...newRequests.find(reservation => reservation.id === id), isApproved: true }
            ]);
        } catch (error) {
            console.error('Error approving reservation:', error);
        }
    };

    const handleDecline = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify([
                    {
                        "op": "replace",
                        "path": "/status",
                        "value": "CANCELED"
                    }
                ])
            });

            if (!response.ok) throw new Error(`Failed to decline reservation: ${await response.text()}`);

            // Update the UI
            setNewRequests(prev => prev.filter(reservation => reservation.id !== id));
        } catch (error) {
            console.error('Error declining reservation:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify([
                    {
                        "op": "replace",
                        "path": "/status",
                        "value": "DELETED"
                    }
                ])
            });

            if (!response.ok) throw new Error(`Failed to delete reservation: ${await response.text()}`);

            // Update the UI
            setPlannedWalks(prev => prev.filter(reservation => reservation.id !== id));
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };

    // Show more cards logic for new requests and planned walks
    const handleShowMoreRequests = () => {
        setDisplayCountRequests(prev => (prev >= newRequests.length ? 2 : prev + 2));
    };

    const handleShowMorePlanned = () => {
        setDisplayCountPlanned(prev => (prev >= plannedWalks.length ? 2 : prev + 2));
    };

    return (
        <div className="container mx-auto">
            <Header />
            <div className="flex flex-col md:flex-row items-start md:items-center mt-10 md:mt-10">
                <div className="md:ml-12 lg:ml-20 xl:ml-32">
                    {user ? <UserHeader user={user} /> : <p>Loading user information...</p>}
                </div>
            </div>
            {user && <UserNav role={user.role} />}

            <div className="ml-12 md:ml-20 xl:ml-36 mb-14">
                <h2 className="text-2xl font-semibold mb-6">New Requests</h2>
                <div className="flex flex-wrap gap-20">
                    {newRequests.slice(0, displayCountRequests).map(reservation => (
                        <UserReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onApprove={handleApprove}
                            onDecline={handleDecline}
                            isNewRequest={true}
                        />
                    ))}
                </div>
                {newRequests.length > 2 && (
                    <div className="flex justify-center my-4">
                        <button
                            onClick={handleShowMoreRequests}
                            className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                        >
                            <span className="text-lg font-bold">...</span>
                        </button>
                    </div>
                )}

                <h2 className="text-2xl font-semibold mb-6 mt-10">Planned Walks</h2>
                <div className="flex flex-wrap gap-6">
                    {plannedWalks.slice(0, displayCountPlanned).map(reservation => (
                        <UserReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onDelete={handleDelete}
                            isNewRequest={false}
                        />
                    ))}
                </div>
                {plannedWalks.length > 2 && (
                    <div className="flex justify-center my-4">
                        <button
                            onClick={handleShowMorePlanned}
                            className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                        >
                            <span className="text-lg font-bold">...</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserReservationsConfirm;
