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
    const [user, setUser] = useState(null);
    const [newRequests, setNewRequests] = useState([]);
    const [plannedWalks, setPlannedWalks] = useState([]);
    const [filteredPlannedWalks, setFilteredPlannedWalks] = useState([]);
    const [filters, setFilters] = useState({ animalName: '', animalBreed: '' });
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

                setNewRequests(data.filter((reservation) => reservation.status === 0));
                const upcomingWalks = data.filter((reservation) => reservation.status === 1);
                setPlannedWalks(upcomingWalks);
                setFilteredPlannedWalks(upcomingWalks); // Initialize filtered walks
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchUser();
        fetchReservations();
    }, [navigate]);

    useEffect(() => {
        const debounceFilter = setTimeout(() => {
            const filtered = plannedWalks.filter((walk) => {
                const matchesName = filters.animalName
                    ? walk.animalName.toLowerCase().includes(filters.animalName.toLowerCase())
                    : true;
                const matchesBreed = filters.animalBreed
                    ? walk.animalBreed.toLowerCase().includes(filters.animalBreed.toLowerCase())
                    : true;
                return matchesName && matchesBreed;
            });
            setFilteredPlannedWalks(filtered);
        }, 100);

        return () => clearTimeout(debounceFilter);
    }, [filters, plannedWalks]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
        setDisplayCountPlanned((prev) => (prev >= filteredPlannedWalks.length ? 2 : prev + 2));
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <UserHeader user={user} />
            <UserNav role={user.role} />

            <div className="w-full max-w-[1024px] mx-auto flex flex-col">
                <h2 className="text-2xl font-semibold mb-6">New Requests</h2>
                <div className="flex flex-wrap gap-20">
                    {newRequests.slice(0, displayCountRequests).map((reservation) => (
                        <Card
                            key={reservation.id}
                            title={`Walk with ${reservation.animalName}`}
                            imageSrc={reservation.photo || icons.placeholder}
                            infoItems={[
                                { icon: icons.volunteer, label: 'Volunteer', value: reservation.volunteerName },
                                { icon: icons.animal, label: 'Animal', value: `${reservation.animalName} (${reservation.animalBreed})` },
                                { icon: icons.phone, label: 'Phone number', value: reservation.phoneNumber },
                                { icon: icons.date, label: 'Date', value: new Date(reservation.reservationDate).toLocaleDateString() },
                                { icon: icons.time, label: 'Time', value: `${reservation.startTime.slice(0, 5)} - ${reservation.endTime.slice(0, 5)}`},
                            ]}
                            buttons={[
                                { text: 'Decline', variant: 'red', icon: icons.decline, onClick: () => handleDecline(reservation.id), className: 'px-5 py-2 w-full' },
                                { text: 'Approve', variant: 'blue', icon: icons.approve, onClick: () => handleApprove(reservation.id), className: 'px-5 py-2 w-full' },
                            ]}
                        />
                    ))}
                </div>
                {newRequests.length > displayCountRequests && <ShowMoreButton onClick={handleShowMoreRequests} />}

                <h2 className="text-2xl font-semibold mb-6 mt-10">Planned Walks</h2>
                <div className="mb-6">
                    <div className="flex items-start gap-10 bg-gray-100 p-4 rounded-lg shadow">
                        <input
                            type="text"
                            name="animalName"
                            placeholder="Filter by animal name"
                            value={filters.animalName}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-md w-1/4 focus:outline-none focus:border-main-blue"
                        />
                        <input
                            type="text"
                            name="animalBreed"
                            placeholder="Filter by breed"
                            value={filters.animalBreed}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-md w-1/4 focus:outline-none focus:border-main-blue"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-20">
                    {filteredPlannedWalks.map((reservation) => (
                        <Card
                            key={reservation.id}
                            title={`Walk with ${reservation.animalName}`}
                            imageSrc={reservation.photo || icons.placeholder}
                            infoItems={[
                                { icon: icons.volunteer, label: 'Volunteer', value: reservation.volunteerName },
                                { icon: icons.animal, label: 'Animal', value: `${reservation.animalName} (${reservation.animalBreed})` },
                                { icon: icons.phone, label: 'Phone number', value: reservation.phoneNumber },
                                { icon: icons.date, label: 'Date', value: new Date(reservation.reservationDate).toLocaleDateString() },
                                { icon: icons.time, label: 'Time', value: `${reservation.startTime.slice(0, 5)} - ${reservation.endTime.slice(0, 5)}`},
                            ]}
                            buttons={[
                                { text: 'Missed', variant: 'red', icon: icons.decline, onClick: () => handleMarkAsMissed(reservation.id), className: 'px-5 py-2 w-full' },
                                { text: 'Completed', variant: 'blue', icon: icons.approve, onClick: () => handleMarkAsCompleted(reservation.id), className: 'px-5 py-2 w-full' },
                            ]}
                        />
                    ))}
                </div>
                {filteredPlannedWalks.length === 0 && (
                    <p className="text-center text-gray-500 mt-4 mb-6">No walks found</p>
                )}
            </div>
        </div>
    );
}

export default UserReservationsConfirm;
