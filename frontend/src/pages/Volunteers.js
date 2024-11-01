import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import API_BASE_URL from "../config";
import VolunteerCard from "../components/VolunteerCard";

function Volunteers() {
    const [user, setUser] = useState(null);
    const [newRequests, setNewRequests] = useState([]);
    const [currentVolunteers, setCurrentVolunteers] = useState([]);
    const [displayCountRequests, setDisplayCountRequests] = useState(2); // Counter for new requests
    const [displayCountVolunteers, setDisplayCountVolunteers] = useState(2); // Counter for current volunteers
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

        const fetchVolunteers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/volunteers`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to fetch volunteers');

                const data = await response.json();
                setNewRequests(data.filter(volunteer => !volunteer.isVerified));
                setCurrentVolunteers(data.filter(volunteer => volunteer.isVerified));
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            }
        };

        fetchUser();
        fetchVolunteers();
    }, [navigate]);

    const handleApprove = async (id) => {
        try {
            console.log(`Sending PATCH request to approve volunteer ${id}`);
            const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify([
                    {
                        "op": "replace",
                        "path": "/isVerified",
                        "value": true
                    }
                ])
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to approve volunteer: ${errorText}`);
            }

            console.log('Volunteer approved successfully');

            // Move volunteer from newRequests to currentVolunteers with updated details
            setNewRequests(prev => prev.filter(volunteer => volunteer.id !== id));
            setCurrentVolunteers(prev => [
                ...prev,
                { ...newRequests.find(volunteer => volunteer.id === id), isVerified: true }
            ]);
        } catch (error) {
            console.error('Error approving volunteer:', error);
        }
    };

    const handleDecline = async (id) => {
        try {
            console.log(`Sending PATCH request to delete volunteer ${id}`);
            const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify([
                    {
                        "op": "replace",
                        "path": "/isVerified",
                        "value": false
                    }
                ])
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete volunteer: ${errorText}`);
            }

            console.log('Volunteer marked for deletion successfully');

            // Move volunteer from currentVolunteers to newRequests
            setCurrentVolunteers(prev => prev.filter(volunteer => volunteer.id !== id));
            setNewRequests(prev => [
                ...prev,
                { ...currentVolunteers.find(volunteer => volunteer.id === id), isVerified: false }
            ]);
        } catch (error) {
            console.error('Error deleting volunteer:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log(`Sending DELETE request to decline volunteer ${id}`);
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'X-Request-Type': 'DeleteUser'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to decline volunteer: ${errorText}`);
            }

            console.log('Volunteer declined and deleted successfully');
            setNewRequests(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            console.error('Error declining volunteer:', error);
        }
    };

    // Handle "Show More" logic for new requests
    const handleShowMoreRequests = () => {
        if (displayCountRequests >= newRequests.length) {
            setDisplayCountRequests(2); // Reset if at the end
        } else {
            setDisplayCountRequests(displayCountRequests + 2); // Show next 2
        }
    };

    // Handle "Show More" logic for current volunteers
    const handleShowMoreVolunteers = () => {
        if (displayCountVolunteers >= currentVolunteers.length) {
            setDisplayCountVolunteers(2); // Reset if at the end
        } else {
            setDisplayCountVolunteers(displayCountVolunteers + 2); // Show next 2
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <div className="flex flex-col md:flex-row items-start md:items-center mt-10 md:mt-10">
                <div className="md:ml-12 lg:ml-20 xl:ml-32">
                    <UserHeader user={user}/>
                </div>
            </div>
            <UserNav role={user.role}/>

            <div className="ml-12 md:ml-20 xl:ml-36 mb-14">
                {/* New Requests */}
                <h2 className="text-lg font-semibold mt-8">New Requests</h2>
                <div className="flex flex-wrap gap-20 mt-4">
                    {newRequests.slice(0, displayCountRequests).map(volunteer => (
                        <VolunteerCard
                            key={volunteer.id}
                            volunteer={volunteer}
                            onApprove={handleApprove}
                            onDelete={handleDelete}
                            isRequest={true}
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

                {/* Current Volunteers */}
                <h2 className="text-lg font-semibold mt-8">Current Volunteers</h2>
                <div className="flex flex-wrap gap-20 mt-4">
                    {currentVolunteers.slice(0, displayCountVolunteers).map(volunteer => (
                        <VolunteerCard
                            key={volunteer.id}
                            volunteer={volunteer}
                            onUnverify={handleDecline}
                            onDelete={handleDelete}
                            isRequest={false}
                        />
                    ))}
                </div>
                {currentVolunteers.length > 2 && (
                    <div className="flex justify-center my-4">
                        <button
                            onClick={handleShowMoreVolunteers}
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

export default Volunteers;
