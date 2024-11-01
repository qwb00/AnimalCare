import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import Header from '../components/Header';
import UserHeader from '../components/UserHeader';
import UserNav from '../components/UserNav';
import Card from '../components/Card';
import ShowMoreButton from '../components/ShowMoreButton';
import { icons } from '../components/icons';

function UserReservationsConfirm() {
    const [user, setUser] = useState(null);
    const [newRequests, setNewRequests] = useState([]);
    const [plannedWalks, setPlannedWalks] = useState([]);
    const [displayCountRequests, setDisplayCountRequests] = useState(2);
    const [displayCountPlanned, setDisplayCountPlanned] = useState(2);
    const navigate = useNavigate();

    // Map status values to labels
    const statusLabels = {
        0: 'NOT DECIDED',
        1: 'UPCOMING',
        2: 'COMPLETED',
        3: 'MISSED',
        4: 'CANCELED',
    };

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

                // Planned Walks: Reservations with date/time in the future
                setPlannedWalks(
                    data.filter((reservation) => {
                        return (
                            reservation.status === 1   // only UPCOMING reservations
                        );
                    })
                );
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchUser();
        fetchReservations();
    }, [navigate]);

    // Approve Reservation
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

            // Optionally, add it to plannedWalks
            // Fetch the updated reservation and add it to plannedWalks
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

            // Update reservation status in plannedWalks
            setPlannedWalks((prev) =>
                prev.map((reservation) =>
                    reservation.id === id ? { ...reservation, status: 3 } : reservation
                )
            );
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

            // Update reservation status in plannedWalks
            setPlannedWalks((prev) =>
                prev.map((reservation) =>
                    reservation.id === id ? { ...reservation, status: 2 } : reservation
                )
            );
        } catch (error) {
            console.error('Error marking reservation as completed:', error);
        }
    };

    // Show more logic for requests
    const handleShowMoreRequests = () => {
        setDisplayCountRequests((prev) => (prev >= newRequests.length ? 2 : prev + 2));
    };

    // Show more logic for planned walks
    const handleShowMorePlanned = () => {
        setDisplayCountPlanned((prev) => (prev >= plannedWalks.length ? 2 : prev + 2));
    };

    if (!user) return <div>Loading...</div>;

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
                <div className="flex flex-wrap gap-6">
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
