import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import API_BASE_URL from "../config";
import Card from "../components/Card";
import Button from "../components/Button";
import { icons } from "../components/icons";
import ErrorMessages from "../components/ErrorMessages";

function Users() {
  const [user, setUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    caretaker: false,
    veterinarian: false,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Fetch the logged-in user data
  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  };

  // Fetch filtered users from the server
  const fetchFilteredUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const queryParams = new URLSearchParams();

      if (filters.name) queryParams.append("name", filters.name);
      if (filters.email) queryParams.append("email", filters.email);
      if (filters.phoneNumber) queryParams.append("phoneNumber", filters.phoneNumber);

      // Map roles to query parameters
      if (filters.caretaker) queryParams.append("role", "Caretaker");
      if (filters.veterinarian) queryParams.append("role", "Veterinarian");

      const response = await axios.get(`${API_BASE_URL}/users?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };

  // Fetch user data and initial user list
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUser();
    fetchFilteredUsers(); // Fetch initial data
  }, [navigate]);

  // Refetch data when filters change
  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchFilteredUsers();
    }, 100);

    return () => clearTimeout(debounceFetch);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

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

      // Refresh the user list after deletion
      fetchFilteredUsers();
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/users`, newUser, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      await fetchFilteredUsers();
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: name === "roles" ? [value] : value,
    }));
  };

  if (!user) return <div>Loading...</div>;

  return (
      <div className="container mx-auto">
        <Header />
        <UserHeader user={user} />
        <UserNav role={user.role} />

        {/* Filters Section */}
        <div className="w-full max-w-[1024px] mx-auto mb-6">
          <Button
              text="Add New User"
              icon="/icons/plus_white.png"
              iconSize="w-4 h-4"
              variant="blue"
              onClick={() => setIsModalOpen(true)}
              className="w-50 mb-4"
          />
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow">
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
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                    type="checkbox"
                    name="caretaker"
                    checked={filters.caretaker}
                    onChange={handleFilterChange}
                    className="appearance-none mr-2 h-5 w-5 cursor-pointer rounded border border-gray-400 bg-white checked:bg-main-blue checked:border-main-blue relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                />
                Caretaker
              </label>
              <label className="flex items-center">
                <input
                    type="checkbox"
                    name="veterinarian"
                    checked={filters.veterinarian}
                    onChange={handleFilterChange}
                    className="appearance-none mr-2 h-5 w-5 cursor-pointer rounded border border-gray-400 bg-white checked:bg-main-blue checked:border-main-blue relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                />

                Veterinarian
              </label>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="w-full max-w-[1024px] mx-auto mb-14">
          <h3 className="text-lg font-semibold mt-8">Users</h3>
          <div className="flex flex-wrap gap-20 mt-4">
            {filteredUsers.map((filteredUser) => (
                <Card
                    key={filteredUser.id}
                    imageSrc={filteredUser.photo || icons.placeholder}
                    infoItems={[
                      { icon: icons.name, label: "Full Name", value: filteredUser.name },
                      { icon: icons.email, label: "E-mail", value: filteredUser.email },
                      { icon: icons.phone, label: "Phone Number", value: filteredUser.phoneNumber },
                      { icon: icons.role, label: "Role", value: filteredUser.role },
                    ]}
                    buttons={[
                      {
                        text: "Delete",
                        variant: "red",
                        icon: icons.cancel,
                        onClick: () => openDeleteModal(filteredUser),
                        className: "px-6 py-2.5 text-sm",
                      },
                    ]}
                />
            ))}
          </div>
          {filteredUsers.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No users found.</p>
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
                  Are you sure you want to delete {selectedUser.name}?
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
