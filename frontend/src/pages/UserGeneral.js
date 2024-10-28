import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserBasicInfo from "../components/UserBasicInfo";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import UserReservations from "../components/UserReservations";
import API_BASE_URL from "../config";

function UserGeneral() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if user is not authenticated
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    // Function to update the user data after editing
    const updateUser = (updatedUserData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...updatedUserData,
        }));
    };

    if (!user) {
        return null; // Return null if user data is not available
    }

    return (
        <div className="container mx-auto">
            <Header/>
            <div className="flex flex-col md:flex-row items-start md:items-center mt-10 md:mt-10">
                <div className="md:ml-12 lg:ml-20 xl:ml-32">
                    <UserHeader user={user} />
                </div>
            </div>

            {/* Navigation Menu */}
            <UserNav role={user.role} />

            {/* User Basic Info */}
            <div className="ml-16 md:ml-24 xl:ml-30 flex flex-col lg:flex-row gap-8 mt-8 mb-14">
                <div className="lg:w-1/2 xl:w-2/5">
                    <UserBasicInfo user={user} updateUser={updateUser} />
                </div>
                <div className="lg:w-1/2 xl:w-2/3">
                    <UserReservations userId={user.id}/>
                </div>
            </div>
        </div>
    );
}

export default UserGeneral;
