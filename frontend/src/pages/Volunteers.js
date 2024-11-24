import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserHeader from '../components/UserHeader';
import UserNav from '../components/UserNav';
import API_BASE_URL from '../config';
import Card from '../components/Card';
import ShowMoreButton from '../components/ShowMoreButton';
import { icons } from '../components/icons';

function Volunteers() {
    const [user, setUser] = useState(null); // Stores logged-in user data
    const [newRequests, setNewRequests] = useState([]); // Stores unverified volunteer requests
    const [currentVolunteers, setCurrentVolunteers] = useState([]); // Stores verified volunteers
    const [displayCountRequests, setDisplayCountRequests] = useState(2); // Controls number of displayed requests
    const [displayCountVolunteers, setDisplayCountVolunteers] = useState(2); // Controls number of displayed volunteers
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

        const fetchVolunteers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/volunteers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to fetch volunteers');

                const data = await response.json();
                setNewRequests(data.filter((volunteer) => !volunteer.isVerified));
                setCurrentVolunteers(data.filter((volunteer) => volunteer.isVerified));
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            }
        };

        fetchUser();
        fetchVolunteers();
    }, [navigate]);

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify([
                    {
                        op: 'replace',
                        path: '/isVerified',
                        value: true,
                    },
                ]),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to approve volunteer: ${errorText}`);
            }

            // Move volunteer from newRequests to currentVolunteers
            setNewRequests((prev) => prev.filter((volunteer) => volunteer.id !== id));
            const approvedVolunteer = newRequests.find((volunteer) => volunteer.id === id);
            setCurrentVolunteers((prev) => [...prev, { ...approvedVolunteer, isVerified: true }]);
        } catch (error) {
            console.error('Error approving volunteer:', error);
        }
    };

    const handleDecline = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify([
                    {
                        op: 'replace',
                        path: '/isVerified',
                        value: false,
                    },
                ]),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to unverify volunteer: ${errorText}`);
            }

            // Move volunteer from currentVolunteers to newRequests
            setCurrentVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== id));
            const unverifiedVolunteer = currentVolunteers.find((volunteer) => volunteer.id === id);
            setNewRequests((prev) => [...prev, { ...unverifiedVolunteer, isVerified: false }]);
        } catch (error) {
            console.error('Error unverifying volunteer:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'X-Request-Type': 'DeleteUser',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete volunteer: ${errorText}`);
            }

            // Remove volunteer from both lists
            setNewRequests((prev) => prev.filter((v) => v.id !== id));
            setCurrentVolunteers((prev) => prev.filter((v) => v.id !== id));
        } catch (error) {
            console.error('Error deleting volunteer:', error);
        }
    };

    // Show more logic
    const handleShowMoreRequests = () => {
        setDisplayCountRequests((prev) => (prev >= newRequests.length ? 2 : prev + 2));
    };

    const handleShowMoreVolunteers = () => {
        setDisplayCountVolunteers((prev) => (prev >= currentVolunteers.length ? 2 : prev + 2));
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <UserHeader user={user} />
            <UserNav role={user.role} />

            <div className="w-full max-w-[1024px] mx-auto mb-14">
                {/* New Requests */}
                <h2 className="text-lg font-semibold mt-8">New Requests</h2>
                <div className="flex flex-wrap gap-20 mt-4">
                    {newRequests.slice(0, displayCountRequests).map((volunteer) => (
                        <Card
                            key={volunteer.id}
                            imageSrc={volunteer.photo || icons.placeholder}
                            infoItems={[
                                {
                                    icon: icons.name,
                                    label: 'Full Name',
                                    value: volunteer.name,
                                },
                                {
                                    icon: icons.phone,
                                    label: 'Phone Number',
                                    value: volunteer.phoneNumber,
                                },
                                {
                                    icon: icons.email,
                                    label: 'E-mail',
                                    value: volunteer.email,
                                },
                            ]}
                            buttons={[
                                {
                                    text: 'Delete',
                                    variant: 'red',
                                    icon: icons.cancel,
                                    onClick: () => handleDelete(volunteer.id),
                                    className: 'px-6 py-2.5 text-sm',
                                },
                                {
                                    text: 'Approve',
                                    variant: 'blue',
                                    icon: icons.approve,
                                    onClick: () => handleApprove(volunteer.id),
                                    className: 'px-6 py-2.5 text-sm',
                                },
                            ]}
                        />
                    ))}
                </div>
                {newRequests.length > 2 && <ShowMoreButton onClick={handleShowMoreRequests} />}

                {/* Current Volunteers */}
                <h2 className="text-lg font-semibold mt-8">Current Volunteers</h2>
                <div className="flex flex-wrap gap-20 mt-4">
                    {currentVolunteers.slice(0, displayCountVolunteers).map((volunteer) => (
                        <Card
                            key={volunteer.id}
                            imageSrc={volunteer.photo || icons.placeholder}
                            infoItems={[
                                {
                                    icon: icons.name,
                                    label: 'Full Name',
                                    value: volunteer.name,
                                },
                                {
                                    icon: icons.phone,
                                    label: 'Phone Number',
                                    value: volunteer.phoneNumber,
                                },
                                {
                                    icon: icons.email,
                                    label: 'E-mail',
                                    value: volunteer.email,
                                },
                            ]}
                            buttons={[
                                {
                                    text: 'Delete',
                                    variant: 'red',
                                    icon: icons.cancel,
                                    onClick: () => handleDelete(volunteer.id),
                                    className: 'px-6 py-2.5 text-sm',
                                },
                                {
                                    text: 'Unverify',
                                    variant: 'yellow',
                                    icon: icons.unverify,
                                    onClick: () => handleDecline(volunteer.id),
                                    className: 'px-6 py-2.5 text-sm',
                                },
                            ]}
                        />
                    ))}
                </div>
                {currentVolunteers.length > 2 && <ShowMoreButton onClick={handleShowMoreVolunteers} />}
            </div>
        </div>
    );
}

export default Volunteers;
