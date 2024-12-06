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

function Users() {
  const [user, setUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
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

  if (!user) return <div>Loading...</div>;

  return (
      <div className="container mx-auto">
        <Header />
        <UserHeader user={user} />
        <UserNav role={user.role} />

        {/* Filters Section */}
        <div className="w-full max-w-[1024px] mx-auto mb-6">
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow">
            <input
                type="text"
                name="name"
                placeholder="Filter by name"
                value={filters.name}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 rounded-md w-1/4"
            />
            <input
                type="email"
                name="email"
                placeholder="Filter by email"
                value={filters.email}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 rounded-md w-1/4"
            />
            <input
                type="text"
                name="phoneNumber"
                placeholder="Filter by phone number"
                value={filters.phoneNumber}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 rounded-md w-1/4"
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                    type="checkbox"
                    name="caretaker"
                    checked={filters.caretaker}
                    onChange={handleFilterChange}
                    className="mr-2"
                />
                Caretaker
              </label>
              <label className="flex items-center">
                <input
                    type="checkbox"
                    name="veterinarian"
                    checked={filters.veterinarian}
                    onChange={handleFilterChange}
                    className="mr-2"
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
      </div>
  );
}

export default Users;
