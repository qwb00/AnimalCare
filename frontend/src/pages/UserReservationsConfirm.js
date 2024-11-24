import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import Header from '../components/Header';
import UserHeader from '../components/UserHeader';
import UserNav from '../components/UserNav';
import Card from '../components/Card';
import ShowMoreButton from '../components/ShowMoreButton';
import { icons } from '../components/icons';
import Button from "../components/Button";

function UserReservationsConfirm() {
    const [user, setUser] = useState(null); // Stores the logged-in user's data
    const [newRequests, setNewRequests] = useState([]); // Stores new reservation requests with status "NOT DECIDED"
    const [plannedWalks, setPlannedWalks] = useState([]); // Stores planned walks with status "UPCOMING"
    const [displayCountRequests, setDisplayCountRequests] = useState(2); // Controls the number of displayed requests
    const [displayCountPlanned, setDisplayCountPlanned] = useState(2); // Controls the number of displayed planned walks
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

        const fetchReservations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/reservations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch reservations');
                const data = await response.json();

                // New Requests: Reservations with status 0 (NOT DECIDED)
                setNewRequests(data.filter((reservation) => reservation.status === 0));

                // Planned Walks: Reservations with status 1 (UPCOMING)
                setPlannedWalks(data.filter((reservation) => reservation.status === 1));
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
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify([
                    { op: 'replace', path: '/status', value: 1 }, // UPCOMING
                ]),
            });

            if (!response.ok) throw new Error(`Failed to approve reservation: ${await response.text()}`);

            // Remove reservation from newRequests
            setNewRequests((prev) => prev.filter((reservation) => reservation.id !== id));

            // adding it to plannedWalks
            setPlannedWalks((prev) => [...prev, newRequests.find((reservation) => reservation.id === id)]);
        } catch (error) {
            console.error('Error approving reservation:', error);
        }
    };

    // Decline Reservation
    const handleDecline = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify([
                    { op: 'replace', path: '/status', value: 4 }, // CANCELED
                ]),
            });

            if (!response.ok) throw new Error(`Failed to decline reservation: ${await response.text()}`);

            // Remove reservation from newRequests
            setNewRequests((prev) => prev.filter((reservation) => reservation.id !== id));
        } catch (error) {
            console.error('Error declining reservation:', error);
        }
    };

    // Mark Reservation as Missed
    const handleMarkAsMissed = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify([
                    { op: 'replace', path: '/status', value: 3 }, // MISSED
                ]),
            });

            if (!response.ok) throw new Error(`Failed to mark reservation as missed: ${await response.text()}`);

            // Remove reservation from plannedWalks
            setPlannedWalks((prev) => prev.filter((reservation) => reservation.id !== id));
        } catch (error) {
            console.error('Error marking reservation as missed:', error);
        }
    };

    // Mark Reservation as Completed
    const handleMarkAsCompleted = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify([
                    { op: 'replace', path: '/status', value: 2 }, // COMPLETED
                ]),
            });

            if (!response.ok) throw new Error(`Failed to mark reservation as completed: ${await response.text()}`);

            // Remove reservation from plannedWalks
            setPlannedWalks((prev) => prev.filter((reservation) => reservation.id !== id));
        } catch (error) {
            console.error('Error marking reservation as completed:', error);
        }
    };

    const handleShowMoreRequests = () => {
        setDisplayCountRequests((prev) => (prev >= newRequests.length ? 2 : prev + 2));
    };

    const handleShowMorePlanned = () => {
        setDisplayCountPlanned((prev) => (prev >= plannedWalks.length ? 2 : prev + 2));
    };

    const handleNavigateToReservations = () => {
        navigate('/reservations');
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />

            <UserHeader user={user} />
            <UserNav role={user.role} />

            <div className="w-full max-w-[1024px] mx-auto flex flex-col">
                {/* Update Schedule Button */}
                <div className="flex justify-start mt-4 mr-4">
                    <Button
                        text="Update Schedule"
                        variant="blue"
                        icon={icons.plus_white}
                        onClick={handleNavigateToReservations}
                        className="mb-4"
                    />
                </div>
                {/* New Requests */}
                <h2 className="text-2xl font-semibold mb-6">New Requests</h2>
                <div className="flex flex-wrap gap-20">
                    {newRequests.slice(0, displayCountRequests).map((reservation) => {
                        const reservationDate = new Date(reservation.reservationDate).toLocaleDateString();
                        const startTime = reservation.startTime.slice(0, 5);
                        const endTime = reservation.endTime.slice(0, 5);
                        const timeRange = `${startTime} - ${endTime}`;

                        return (
                            <Card
                                key={reservation.id}
                                title={`Walk with ${reservation.animalName} on ${reservationDate}`}
                                imageSrc={reservation.photo || icons.placeholder}
                                infoItems={[
                                    { icon: icons.volunteer, label: 'Volunteer', value: reservation.volunteerName },
                                    { icon: icons.animal, label: 'Animal', value: `${reservation.animalName} (${reservation.animalBreed})` },
                                    { icon: icons.date, label: 'Date', value: reservationDate },
                                    { icon: icons.time, label: 'Time', value: timeRange },
                                ]}
                                buttons={[
                                    { text: 'Decline', variant: 'red', icon: icons.decline, onClick: () => handleDecline(reservation.id), className: 'px-5 py-2' },
                                    { text: 'Approve', variant: 'blue', icon: icons.approve, onClick: () => handleApprove(reservation.id), className: 'px-5 py-2' },
                                ]}
                            />
                        );
                    })}
                </div>
                {newRequests.length > 2 && <ShowMoreButton onClick={handleShowMoreRequests} />}

                {/* Planned Walks */}
                <h2 className="text-2xl font-semibold mb-6 mt-10">Planned Walks</h2>
                <div className="flex flex-wrap gap-20">
                    {/* Shows only defined number of walks */}
                    {plannedWalks.slice(0, displayCountPlanned).map((reservation) => {
                        const reservationDate = new Date(reservation.reservationDate).toLocaleDateString();
                        const startTime = reservation.startTime.slice(0, 5);
                        const endTime = reservation.endTime.slice(0, 5);
                        const timeRange = `${startTime} - ${endTime}`;

                        return (
                            <Card
                                key={reservation.id}
                                title={`Walk with ${reservation.animalName} on ${reservationDate}`}
                                imageSrc={reservation.photo || icons.placeholder}
                                infoItems={[
                                    { icon: icons.volunteer, label: 'Volunteer', value: reservation.volunteerName },
                                    { icon: icons.animal, label: 'Animal', value: `${reservation.animalName} (${reservation.animalBreed})` },
                                    { icon: icons.date, label: 'Date', value: reservationDate },
                                    { icon: icons.time, label: 'Time', value: timeRange },
                                ]}
                                buttons={[
                                    { text: 'Missed', variant: 'red', icon: icons.decline, onClick: () => handleMarkAsMissed(reservation.id), className: 'px-5 py-2 w-full' },
                                    { text: 'Completed', variant: 'blue', icon: icons.approve, onClick: () => handleMarkAsCompleted(reservation.id), className: 'px-5 py-2 w-full' },
                                ]}
                            />
                        );
                    })}
                </div>
                {plannedWalks.length > 2 && <ShowMoreButton onClick={handleShowMorePlanned} />}
            </div>
        </div>
    );
}

export default UserReservationsConfirm;
