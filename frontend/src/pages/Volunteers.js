// Aleksander Postelga xposte00

/*
* Volunteers approval page in user dashboard
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserHeader from '../components/UserHeader';
import UserNav from '../components/UserNav';
import API_BASE_URL from '../config';
import Card from '../components/Card';
import { icons } from '../components/icons';

function Volunteers() {
    const [user, setUser] = useState(null); // Stores logged-in user data
    const [volunteers, setVolunteers] = useState([]); // Stores all volunteers
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    }); // Filters for volunteers
    const [statusFilter, setStatusFilter] = useState(0); // Filter by VolunteerStatus
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetches user data
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

        fetchUser();
        fetchVolunteers(); // Fetch initial volunteers data
    }, [navigate]);

    // Fetches volunteers based on filter
    const fetchVolunteers = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const queryParams = new URLSearchParams();
            if (filters.name) queryParams.append('Name', filters.name);
            if (filters.email) queryParams.append('Email', filters.email);
            if (filters.phoneNumber) queryParams.append('PhoneNumber', filters.phoneNumber);

            const response = await fetch(`${API_BASE_URL}/volunteers?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch volunteers');

            const data = await response.json();
            setVolunteers(data); // Set all volunteers
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
    };

    // A unified function to handle all PATCH request actions
    const handleAction = async (id, action, value) => {
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
                        path: action,
                        value: value,
                    },
                ]),
            });

            if (!response.ok) throw new Error(`Failed to ${action} volunteer`);

            fetchVolunteers(); // Refresh data after the action
        } catch (error) {
            console.error(`Error performing ${action} action:`, error);
        }
    };

    // Filter by VolunteerStatus
    const filteredVolunteers = volunteers.filter((volunteer) => volunteer.volunteerStatus === statusFilter);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <UserHeader user={user} />
            <UserNav role={user.role} />
            {/* Filters */}
            <div className="w-full max-w-[1024px] mx-auto mb-14">
                <div>
                    <div className="flex items-center gap-6 bg-gray-100 p-4 rounded-lg shadow max-w-[978px]">
                        <input
                            type="text"
                            name="name"
                            placeholder="Filter by name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-md w-1/4 focus:outline-none focus:border-main-blue"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Filter by email"
                            value={filters.email}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-md w-1/4 focus:outline-none focus:border-main-blue"
                        />
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Filter by phone number"
                            value={filters.phoneNumber}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-md w-1/4 focus:outline-none focus:border-main-blue"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(Number(e.target.value))}
                            className="p-2 border border-gray-300 rounded-md w-1/4 focus:outline-none focus:border-main-blue"
                        >
                            <option value={0}>New</option>
                            <option value={1}>Processing</option>
                            <option value={2}>Approved</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-20 mt-4">
                    {filteredVolunteers.map((volunteer) => (
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
                            buttons={(() => {
                                switch (volunteer.volunteerStatus) {
                                    case 0:
                                        return [
                                            {
                                                text: 'Delete',
                                                variant: 'red',
                                                className: 'w-full',
                                                icon: icons.cancel,
                                                onClick: () => handleAction(volunteer.id, '/isActive', false),
                                            },
                                            {
                                                text: 'Process',
                                                variant: 'blue',
                                                icon: icons.process_user,
                                                className: 'w-full',
                                                onClick: () => handleAction(volunteer.id, '/volunteerStatus', 1),
                                            },
                                        ];
                                    case 1:
                                        return [
                                            {
                                                text: 'Delete',
                                                variant: 'red',
                                                className: 'w-full',
                                                icon: icons.cancel,
                                                onClick: async () => {
                                                    await handleAction(volunteer.id, '/volunteerStatus', 0);
                                                    await handleAction(volunteer.id, '/isVerified', false);
                                                    await handleAction(volunteer.id, '/isActive', false);
                                                },
                                            },
                                            {
                                                text: 'Approve',
                                                variant: 'blue',
                                                className: 'w-full',
                                                icon: icons.approve,
                                                onClick: async () => {
                                                    await handleAction(volunteer.id, '/volunteerStatus', 2);
                                                    await handleAction(volunteer.id, '/isVerified', true);
                                                },
                                            },
                                        ];
                                    case 2:
                                        return [
                                            {
                                                text: 'Delete',
                                                variant: 'red',
                                                className: 'w-full',
                                                icon: icons.cancel,
                                                onClick: () => handleAction(volunteer.id, '/isActive', false),
                                            },
                                            {
                                                text: 'Unverify',
                                                variant: 'yellow',
                                                className: 'w-full',
                                                icon: icons.unverify,
                                                onClick: async () => {
                                                    await handleAction(volunteer.id, '/volunteerStatus', 0);
                                                    await handleAction(volunteer.id, '/isVerified', false);
                                                },
                                            },
                                        ];
                                    default:
                                        return [];
                                }
                            })()}
                        />
                    ))}
                </div>
                {/* If no volunteers was found */}
                {filteredVolunteers.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No volunteers found.</p>
                )}
            </div>
        </div>
    );
}

export default Volunteers;
