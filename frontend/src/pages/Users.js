import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import API_BASE_URL from "../config";
import Card from "../components/Card";
import ShowMoreButton from "../components/ShowMoreButton";
import Button from "../components/Button";
import { icons } from "../components/icons";
import ErrorMessages from '../components/ErrorMessages';

function Users() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [displayCount, setDisplayCount] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    roles: ["Caretaker"],
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notification, setNotification] = useState({
    isSuccess: false,
    message: "",
  });
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeUsers = response.data.filter((user) => user.isActive !== false);
      setUsers(activeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch logged-in user data and list of users on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUser();
    fetchAllUsers();
  }, [navigate]);


  // Deactivate a user by setting isActive to false
  const handleDelete = async () => {
    try {
      await axios.patch(
          `${API_BASE_URL}/users/${selectedUser.id}`,
          [{ op: "replace", path: "/isActive", value: false }],
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json-patch+json",
            },
          }
      );

      // Remove the user from the list without refreshing the page
      setUsers((prev) =>
          prev.filter((user) => user.id !== selectedUser.id)
      );

      setSelectedUser(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deactivating user:", error);
      setNotification({
        isSuccess: false,
        message: "Error deactivating user.",
      });
      setIsNotificationOpen(true);
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Show more users when clicking "Show More" button
  const handleShowMore = () => {
    setDisplayCount((prev) => (prev >= users.length ? 2 : prev + 2));
  };

  // Add a new user
  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/users`, newUser, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      await fetchAllUsers();
      setNotification({
        isSuccess: true,
        message: "User created successfully!",
      });
      setIsNotificationOpen(true);

      setIsModalOpen(false);
      setNewUser({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        roles: ["Caretaker"],
      });
    } catch (error) {
      setNotification({
        isSuccess: false,
        message: <ErrorMessages errorData={error.response?.data} /> ,
      });
      setIsNotificationOpen(true);
    }
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: name === "roles" ? [value] : value,
    }));
  };

  const caretakers = users.filter((user) => user.role === "Caretaker");
  const veterinarians = users.filter((user) => user.role === "Veterinarian");

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <Header />
      <UserHeader user={user} />
      <UserNav role={user.role} />

      <div className="w-full max-w-[1024px] mx-auto mb-14">
        <Button
          text="Add New User"
          icon="/icons/plus_white.png"
          iconSize="w-4 h-4"
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
                { icon: icons.name, label: "Full Name", value: caretaker.name },
                {
                  icon: icons.phone,
                  label: "Phone Number",
                  value: caretaker.phoneNumber,
                },
                { icon: icons.email, label: "E-mail", value: caretaker.email },
              ]}
              buttons={[
                {
                  text: "Delete",
                  variant: "red",
                  icon: icons.cancel,
                  onClick: () => openDeleteModal(caretaker),
                  className: "px-6 py-2.5 text-sm",
                },
              ]}
            />
          ))}
        </div>
        {caretakers.length > displayCount && (
          <ShowMoreButton onClick={handleShowMore} />
        )}

        <h3 className="text-lg font-semibold mt-8">Veterinarians</h3>
        <div className="flex flex-wrap gap-20 mt-4">
          {veterinarians.slice(0, displayCount).map((veterinarian) => (
            <Card
              key={veterinarian.id}
              imageSrc={veterinarian.photo || icons.placeholder}
              infoItems={[
                {
                  icon: icons.name,
                  label: "Full Name",
                  value: veterinarian.name,
                },
                {
                  icon: icons.phone,
                  label: "Phone Number",
                  value: veterinarian.phoneNumber,
                },
                {
                  icon: icons.email,
                  label: "E-mail",
                  value: veterinarian.email,
                },
              ]}
              buttons={[
                {
                  text: "Delete",
                  variant: "red",
                  icon: icons.cancel,
                  onClick: () => openDeleteModal(veterinarian),
                  className: "px-6 py-2.5 text-sm",
                },
              ]}
            />
          ))}
        </div>
        {veterinarians.length > displayCount && (
          <ShowMoreButton onClick={handleShowMore} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-red-600 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6 text-center text-red-600">
              Are you sure?
            </h3>
            <p className="text-lg text-center text-gray-800 mb-6">
              Are you sure you want to delete {selectedUser.firstName}{" "}
              {selectedUser.lastName}?
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

      {/* New User Form Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
              ADD NEW USER
            </h3>

            <button
              type="button"
              className="absolute top-3 right-3 bg-main-blue rounded-full p-2"
              aria-label="Close"
              style={{ transform: "rotate(45deg)" }}
              onClick={() => setIsModalOpen(false)}
            >
              <img
                src="/icons/plus_white.png"
                alt="Close"
                className="w-3 h-3"
              />
            </button>

            <form onSubmit={handleAddUser}>
              <div className="mb-3">
                <label className="block text-gray-700 mb-1 font-medium text-sm">
                  First Name
                </label>
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

              <div className="mb-3">
                <label className="block text-gray-700 mb-1 font-medium text-sm">
                  Last Name
                </label>
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

              <div className="mb-3">
                <label className="block text-gray-700 mb-1 font-medium text-sm">
                  Username
                </label>
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

              <div className="mb-3">
                <label className="block text-gray-700 mb-1 font-medium text-sm">
                  Email
                </label>
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

              <div className="mb-3">
                <label className="block text-gray-700 mb-1 font-medium text-sm">
                  Password
                </label>
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

              <div className="mb-3">
                <label className="block text-gray-700 mb-1 font-medium text-sm">
                  Phone Number
                </label>
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

              <div className="mb-6">
                <label className="block text-gray-700 mb-1 font-medium text-sm">
                  Role
                </label>
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

      {isNotificationOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsNotificationOpen(false)}
        >
          <div
            className={`bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 ${
              notification.isSuccess ? "border-green-600" : "border-red-600"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={`text-2xl font-bold mb-6 text-center ${
                notification.isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {notification.isSuccess ? "Success!" : "Error"}
            </h3>
            <p className="text-lg mb-6 text-center text-gray-800">
              {notification.message}
            </p>
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
