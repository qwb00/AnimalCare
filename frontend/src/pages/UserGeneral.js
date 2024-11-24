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
                    const errorText = await response.text();
                    throw new Error(`Failed to update user information: ${errorText}`);
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
        return <div>Loading...</div>; // Return Loading... if user data is not available
    }

    return (
        <div className="container mx-auto px-10">
            <Header/>
            <UserHeader user={user} updateUser={updateUser} />

            {/* Navigation Menu */}
            <UserNav role={user.role} />

            <div className="w-full max-w-[1024px] mx-auto flex flex-col lg:flex-row gap-8 mb-14">
                {/* User Basic Info */}
                <div className="w-full lg:w-1/2 xl:w-2/5">
                    <UserBasicInfo user={user} updateUser={updateUser} />
                </div>
                {/* User Reservations Info */}
                <div className="w-full lg:w-1/2 xl:w-2/3">
                    <UserReservations userId={user.id}/>
                </div>
            </div>
        </div>
    );
}

export default UserGeneral;