/*
  File: UserHeader.js
  Description:
    - Component for displaying user general info including, colored role and photo with ability to update photo.
  
  Author:
    - Aleksei Petrishko [xpetri23]
*/


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUploader from './FileUploader';
import API_BASE_URL from '../config';

function UserHeader({ user, updateUser }) {
    const [avatarUrl, setAvatarUrl] = useState(user.photo || "/icons/name.png");
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        photo: user.photo,
    });

    const roleStyles = {
        administrator: { backgroundColor: '#B872FF', borderColor: '#200E32', textColor: '#000000' },
        volunteer: { backgroundColor: '#D2FFCB', borderColor: '#35CB00', textColor: '#35CB00' },
        caretaker: { backgroundColor: '#CBF3FF', borderColor: '#4BD4FF', textColor: '#4BD4FF' },
        veterinarian: { backgroundColor: '#FEFFCB', borderColor: '#FFDC24', textColor: '#FFDC24' },
    };
    const { backgroundColor, borderColor, textColor } = roleStyles[userData.role.toLowerCase()] || {};

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            photo: user.photo,
        });
        setAvatarUrl(user.photo || "/icons/name.png");
    }, [user]);

    async function updateUserProfile(newPhotoUrl) {
        const updatedData = {
            ...userData,
            photo: newPhotoUrl || userData.photo,
        };

        const patchData = [
            { op: "replace", path: "/FirstName", value: updatedData.name.split(" ")[0] || "" },
            { op: "replace", path: "/LastName", value: updatedData.name.split(" ")[1] || "" },
            { op: "replace", path: "/Email", value: updatedData.email },
            { op: "replace", path: "/PhoneNumber", value: updatedData.phoneNumber },
            { op: "replace", path: "/photo", value: updatedData.photo },
        ];

        try {
            const response = await axios.patch(`${API_BASE_URL}/users/me`, patchData, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
            });

            if (response.status === 204) {
                setUserData(updatedData);
                setAvatarUrl(updatedData.photo); // local update avatar
                updateUser(updatedData); // change user data in parent component
                console.log("User profile updated successfully");
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }

    return (
        <div className="w-full max-w-[1024px] mx-auto flex items-center mb-10 mt-6">
            <div className="relative">
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className={`h-28 w-28 rounded-full mr-6 cursor-pointer object-cover object-center ${
                        avatarUrl === "/icons/name.png" ? "" : "border-black border-2"
                    }`}
                />
                <FileUploader
                    onUpload={(uploadedUrl) => updateUserProfile(uploadedUrl)}
                    onStatusChange={(status) => {
                        if (status === 'success') console.log('Photo uploaded successfully');
                    }}
                    buttonText=""
                    isButton={false}
                    icon="/icons/upload_photo.png"
                    iconSize="w-8 h-8"
                    buttonClassName="absolute top-0 right-0 bg-white rounded-full p-1"
                />
            </div>
            <div>
                <div className="inline-flex items-center relative">
                    <h1 className="text-3xl font-black mb-4 mr-1">{userData.name}</h1>
                    <span
                        className="px-2 py-0.5 rounded-2xl font-semibold"
                        style={{
                            backgroundColor,
                            borderColor,
                            color: textColor,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            position: 'relative',
                            top: '-30px',
                        }}
                    >
                        {userData.role}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default UserHeader;
