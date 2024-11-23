import React, { useState } from 'react';
import Button from '../components/Button';
import ErrorMessages from '../components/ErrorMessages';
import API_BASE_URL from "../config";

function UserBasicInfo({ user, updateUser }) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photo: user.photo,
    });
    const [errorData, setErrorData] = useState(null); // State to store error data

    // Toggle edit mode
    const toggleEditMode = () => setEditMode(!editMode);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to send PATCH request
    const updateUserInfo = async () => {
        const patchData = [
            { op: "replace", path: "/FirstName", value: formData.name.split(" ")[0] || user.name.split(" ")[0] },
            { op: "replace", path: "/LastName", value: formData.name.split(" ")[1] || user.name.split(" ")[1] },
            { op: "replace", path: "/Email", value: formData.email },
            { op: "replace", path: "/PhoneNumber", value: formData.phoneNumber },
            { op: "replace", path: "/photo", value: formData.photo },
        ];

        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json-patch+json',
                },
                body: JSON.stringify(patchData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorData(errorData); // Save error data to display
                throw new Error('Failed to update user information');
            }

            console.log('User information updated successfully');

            // Update user info in the parent component
            updateUser({
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
            });

            setErrorData(null); // Clear any previous error messages
            toggleEditMode(); // Exit edit mode
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    };

    // Format the registration date
    const formattedDate = user.registrationDate
        ? new Date(user.registrationDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        : 'Invalid date';

    return (
        <div className="p-6 border-2 border-gray-200 rounded-lg relative">
            <div className="flex justify-between space-x-8 items-center">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <img
                    src="/icons/pen.png"
                    alt="Edit Icon"
                    className="h-6 w-6 cursor-pointer"
                    onClick={toggleEditMode}
                />
            </div>
            <div className="space-y-3">
                {/* Display error messages */}
                {errorData && <ErrorMessages errorData={errorData} />}

                {/* Full Name */}
                <div className="flex items-start">
                    <img src="/icons/name.png" alt="User Icon" className="h-8 w-8 mr-4" />
                    <div>
                        <p className="text-gray-500 font-semibold">Full Name</p>
                        {editMode ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-black text-md border-b border-gray-300 outline-none focus:border-main-blue"
                            />
                        ) : (
                            <p className="text-black text-md">{user.name}</p>
                        )}
                    </div>
                </div>

                {/* Role */}
                <div className="flex items-start">
                    <img src="/icons/role.png" alt="Role Icon" className="h-8 w-8 mr-4" />
                    <div>
                        <p className="text-gray-500 font-semibold">Role</p>
                        <p className="text-black text-md">{user.role}</p>
                    </div>
                </div>

                {/* E-mail */}
                <div className="flex items-start">
                    <img src="/icons/e-mail.png" alt="Email Icon" className="h-8 w-8 mr-4" />
                    <div>
                        <p className="text-gray-500 font-semibold">E-mail</p>
                        {editMode ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-black text-md border-b border-gray-300 outline-none focus:border-main-blue"
                            />
                        ) : (
                            <p className="text-black text-md">{user.email}</p>
                        )}
                    </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start">
                    <img src="/icons/phone.png" alt="Phone Icon" className="h-8 w-8 mr-4" />
                    <div>
                        <p className="text-gray-500 font-semibold">Phone Number</p>
                        {editMode ? (
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="text-black text-md border-b border-gray-300 outline-none focus:border-main-blue"
                            />
                        ) : (
                            <p className="text-black text-md">{user.phoneNumber}</p>
                        )}
                    </div>
                </div>

                {/* Registration Date */}
                <div className="flex items-start">
                    <img src="/icons/calendar_black.png" alt="Registration Date Icon" className="h-8 w-8 mr-4" />
                    <div>
                        <p className="text-gray-500 font-semibold">Registration Date</p>
                        <p className="text-black text-md">{formattedDate}</p>
                    </div>
                </div>
            </div>

            {/* Finish Editing Button */}
            {editMode && (
                <div className="mt-6">
                    <Button
                        text="Finish Editing"
                        variant="blue"
                        onClick={updateUserInfo}
                    />
                </div>
            )}
        </div>
    );
}

export default UserBasicInfo;
