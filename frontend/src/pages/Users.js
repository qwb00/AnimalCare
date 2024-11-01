// src/pages/Users.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import UserHeader from '../components/UserHeader';
import UserNav from '../components/UserNav';
import API_BASE_URL from '../config';
import Card from '../components/Card';
import ShowMoreButton from '../components/ShowMoreButton';
import Button from '../components/Button';
import { icons } from '../components/icons';

function Users() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [displayCount, setDisplayCount] = useState(2);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        roles: ['Caretaker'],
    });
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({
        isSuccess: false,
        message: '',
    });
    const navigate = useNavigate();

    const fetchAllUsers = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUser();
        fetchAllUsers();
    }, [navigate]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/users/${selectedUser.id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'X-Request-Type': 'DeleteUser',
                },
            });
            setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
            setSelectedUser(null); // Сброс выбранного пользователя
            setIsDeleteModalOpen(false); // Закрытие модального окна
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user); // Сохраняем данные выбранного пользователя
        setIsDeleteModalOpen(true); // Открываем модальное окно подтверждения удаления
    };

    const handleShowMore = () => {
        setDisplayCount((prev) => (prev >= users.length ? 2 : prev + 2));
    };

    const handleAddUser = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                `${API_BASE_URL}/users`,
                newUser,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            await fetchAllUsers(); // Обновляем список пользователей
            setNotification({ isSuccess: true, message: 'User created successfully!' });
            setIsNotificationOpen(true);

            // Закрываем модальное окно и сбрасываем форму
            setIsModalOpen(false);
            setNewUser({ firstName: '', lastName: '', username: '', email: '', password: '', phoneNumber: '', roles: ['Caretaker'] });
        } catch (error) {
            setNotification({ isSuccess: false, message: 'Failed to create user. Please try again.' });
            setIsNotificationOpen(true);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: name === 'roles' ? [value] : value,
        }));
    };

    const caretakers = users.filter((user) => user.role === 'Caretaker');
    const veterinarians = users.filter((user) => user.role === 'Veterinarian');

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <div className="flex flex-col md:flex-row items-start md:items-center mt-10 md:mt-10">
                <div className="md:ml-12 lg:ml-20 xl:ml-32">
                    <UserHeader user={user} />
                </div>
            </div>
            <UserNav role={user.role} />

            <div className="ml-12 md:ml-20 xl:ml-36 mb-14">
                <Button
                    text="Add New User"
                    icon="/icons/plus_white.png"
                    iconSize='w-4 h-4'  
                    variant="blue"
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2 w-50"
                />

<h3 className="text-lg font-semibold mt-8">Caretakers</h3>
                <div className="flex flex-wrap gap-20 mt-4">
                    {caretakers.slice(0, displayCount).map((caretaker) => (
                        <Card
                            key={caretaker.id}
                            imageSrc={caretaker.photo || icons.placeholder}
                            infoItems={[
                                { icon: icons.name, label: 'Full Name', value: caretaker.name },
                                { icon: icons.phone, label: 'Phone Number', value: caretaker.phoneNumber },
                                { icon: icons.email, label: 'E-mail', value: caretaker.email },
                            ]}
                            buttons={[
                                {
                                    text: 'Delete',
                                    variant: 'red',
                                    icon: icons.cancel,
                                    onClick: () => openDeleteModal(caretaker),
                                    className: 'px-6 py-2.5 text-sm',
                                },
                            ]}
                        />
                    ))}
                </div>
                {caretakers.length > displayCount && <ShowMoreButton onClick={handleShowMore} />}

                <h3 className="text-lg font-semibold mt-8">Veterinarians</h3>
                <div className="flex flex-wrap gap-20 mt-4">
                    {veterinarians.slice(0, displayCount).map((veterinarian) => (
                        <Card
                            key={veterinarian.id}
                            imageSrc={veterinarian.photo || icons.placeholder}
                            infoItems={[
                                { icon: icons.name, label: 'Full Name', value: veterinarian.name },
                                { icon: icons.phone, label: 'Phone Number', value: veterinarian.phoneNumber },
                                { icon: icons.email, label: 'E-mail', value: veterinarian.email },
                            ]}
                            buttons={[
                                {
                                    text: 'Delete',
                                    variant: 'red',
                                    icon: icons.cancel,
                                    onClick: () => openDeleteModal(veterinarian),
                                    className: 'px-6 py-2.5 text-sm',
                                },
                            ]}
                        />
                    ))}
                </div>
                {veterinarians.length > displayCount && <ShowMoreButton onClick={handleShowMore} />}
            </div>

            {/* Модальное окно подтверждения удаления */}
            {isDeleteModalOpen && selectedUser && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <div
                        className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-red-600 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-6 text-center text-red-600">Are you sure?</h3>
                        <p className="text-lg text-center text-gray-800 mb-6">
                            Are you sure you want to delete {selectedUser.firstName} {selectedUser.lastName}?
                        </p>
                        <div className="flex justify-center space-x-2">
                            <Button
                                text="Cancel"
                                variant="white"
                                className="px-5 py-2 text-sm"
                                onClick={() => setIsDeleteModalOpen(false)}
                            />
                            <Button
                                text="Delete"
                                variant="red"
                                className="px-5 py-2 text-sm"
                                onClick={handleDelete}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для ввода данных нового пользователя */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setIsModalOpen(false)} // Закрываем модальное окно при клике на затемненную область
                >
                    <div
                        className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black relative"
                        onClick={(e) => e.stopPropagation()} // Останавливаем всплытие, чтобы клик внутри окна не закрывал его
                    >
                        <h3 className="text-xl font-bold mb-6 text-center text-gray-800">ADD NEW USER</h3>

                        {/* Кнопка закрытия */}
                        <button
                            type="button"
                            className="absolute top-3 right-3 bg-main-blue rounded-full p-2"
                            aria-label="Close"
                            style={{ transform: 'rotate(45deg)' }}
                            onClick={() => setIsModalOpen(false)}
                        >
                            <img src="/icons/plus_white.png" alt="Close" className="w-3 h-3" />
                        </button>

                        {/* Поля ввода для нового пользователя */}
                        <form onSubmit={handleAddUser}>
                            {/* First Name */}
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">First Name</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    placeholder="Enter first name"
                                    value={newUser.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">Last Name</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    placeholder="Enter last name"
                                    value={newUser.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                                />
                            </div>

                            {/* Username */}
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">Username</label>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={newUser.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={newUser.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={newUser.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="mb-3">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    type="text"
                                    placeholder="Enter phone number"
                                    value={newUser.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                                />
                            </div>

                            {/* Role Selection */}
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-1 font-medium text-sm">Role</label>
                                <select
                                    name="roles"
                                    value={newUser.roles[0]}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-main-blue text-sm"
                                >
                                    <option value="Caretaker">Caretaker</option>
                                    <option value="Veterinarian">Veterinarian</option>
                                </select>
                            </div>

                            {/* Кнопки подтверждения и отмены */}
                            <div className="flex justify-center space-x-2 mt-4">
                                <Button
                                    text="Cancel"
                                    variant="white"
                                    iconSize="w-5 h-5"
                                    icon="/icons/cancel.png"
                                    iconPosition="right"
                                    className="px-5 py-2 text-sm"
                                    onClick={() => setIsModalOpen(false)}
                                />
                                <Button
                                    text="Confirm"
                                    variant="blue"
                                    iconSize="w-5 h-5"
                                    icon="/icons/confirm_white.png"
                                    iconPosition="right"
                                    className="px-5 py-2 text-sm"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Модальное окно уведомления */}
            {isNotificationOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setIsNotificationOpen(false)}
                >
                    <div
                        className={`bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 ${
                            notification.isSuccess ? 'border-green-600' : 'border-red-600'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            className={`text-2xl font-bold mb-6 text-center ${
                                notification.isSuccess ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {notification.isSuccess ? 'Success!' : 'Error'}
                        </h3>
                        <p className="text-lg mb-6 text-center text-gray-800">{notification.message}</p>
                        <div className="flex justify-center">
                            <Button
                                text="Close"
                                variant="blue"
                                icon="/icons/cancel_white.png"
                                iconPosition="right"
                                className="px-5 py-2"
                                onClick={() => setIsNotificationOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
