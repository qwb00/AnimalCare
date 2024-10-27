import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserBasicInfo from "../components/UserBasicInfo";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";

function UserGeneral() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if user is not authenticated
            return;
        }

        // Fetch user information from API
        const fetchUser = async () => {
            try {
                const response = await fetch('https://animalcaredb-3c73ac350ab8.herokuapp.com/api/users/me', {
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

    if (!user) {
        return null; // Return null if user data is not available
    }

    return (
        <div className="container mx-auto p-8">
            <Header/>
            <div className="flex flex-col md:flex-row items-start md:items-center mt-10 md:mt-10">
                <div className="md:ml-12 lg:ml-20 xl:ml-32">
                    <UserHeader user={user}/>
                </div>
            </div>

            {/* Navigation Menu */}
            <UserNav role={user.role} />

            {/* User Basic Info */}
            <div className="ml-16 md:ml-24 xl:ml-30 w-full lg:w-1/4 xl:w-1/3">
                <UserBasicInfo user={user}/>
            </div>
        </div>
    );
}

export default UserGeneral;
