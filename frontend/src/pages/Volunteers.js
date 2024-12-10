import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import API_BASE_URL from "../config";
import Card from "../components/Card";
import { icons } from "../components/icons";

function Volunteers() {
  const [user, setUser] = useState(null); // Stores logged-in user data
  const [volunteers, setVolunteers] = useState([]); // Stores all volunteers
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  }); // Filters for volunteers
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user information");

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUser();
    fetchVolunteers(); // Fetch initial volunteers data
  }, [navigate]);

  const fetchVolunteers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/volunteers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch volunteers");

      const data = await response.json();
      setVolunteers(data); // Set all volunteers
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesName = filters.name
      ? volunteer.name.toLowerCase().includes(filters.name.toLowerCase())
      : true;
    const matchesEmail = filters.email
      ? volunteer.email.toLowerCase().includes(filters.email.toLowerCase())
      : true;
    const matchesPhoneNumber = filters.phoneNumber
      ? volunteer.phoneNumber.includes(filters.phoneNumber)
      : true;

    return matchesName && matchesEmail && matchesPhoneNumber;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAction = async (id, action, value) => {
    try {
      const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify([
          {
            op: "replace",
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <Header />
      <UserHeader user={user} />
      <UserNav role={user.role} />

      <div className="w-full max-w-[1024px] mx-auto mb-14">
        <div>
          <div className="flex items-start gap-6 bg-gray-100 p-4 rounded-lg shadow  max-w-[978px]">
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
          </div>
        </div>

        <h3 className="text-2xl font-semibold mt-4">New Volunteers</h3>
        <div className="flex flex-wrap gap-20 mt-4">
          {filteredVolunteers
            .filter((volunteer) => !volunteer.isVerified)
            .map((volunteer) => (
              <Card
                key={volunteer.id}
                imageSrc={volunteer.photo || icons.placeholder}
                infoItems={[
                  {
                    icon: icons.name,
                    label: "Full Name",
                    value: volunteer.name,
                  },
                  {
                    icon: icons.phone,
                    label: "Phone Number",
                    value: volunteer.phoneNumber,
                  },
                  {
                    icon: icons.email,
                    label: "E-mail",
                    value: volunteer.email,
                  },
                ]}
                buttons={[
                  {
                    text: "Delete",
                    variant: "red",
                    icon: icons.cancel,
                    onClick: () =>
                      handleAction(volunteer.id, "/isActive", false),
                    className: "px-5 py-2 w-full",
                  },
                  {
                    text: "Approve",
                    variant: "blue",
                    icon: icons.approve,
                    onClick: () =>
                      handleAction(volunteer.id, "/isVerified", true),
                    className: "px-5 py-2 w-full",
                  },
                ]}
              />
            ))}
        </div>

        <h3 className="text-2xl font-semibold mt-8">Current Volunteers</h3>
        <div className="flex flex-wrap gap-20 mt-4">
          {filteredVolunteers
            .filter((volunteer) => volunteer.isVerified)
            .map((volunteer) => (
              <Card
                key={volunteer.id}
                imageSrc={volunteer.photo || icons.placeholder}
                infoItems={[
                  {
                    icon: icons.name,
                    label: "Full Name",
                    value: volunteer.name,
                  },
                  {
                    icon: icons.phone,
                    label: "Phone Number",
                    value: volunteer.phoneNumber,
                  },
                  {
                    icon: icons.email,
                    label: "E-mail",
                    value: volunteer.email,
                  },
                ]}
                buttons={[
                  {
                    text: "Delete",
                    variant: "red",
                    icon: icons.cancel,
                    onClick: () =>
                      handleAction(volunteer.id, "/isActive", false),
                    className: "px-5 py-2 w-full",
                  },
                  {
                    text: "Unverify",
                    variant: "yellow",
                    icon: icons.unverify,
                    onClick: () =>
                      handleAction(volunteer.id, "/isVerified", false),
                    className: "px-5 py-2 w-full",
                  },
                ]}
              />
            ))}
        </div>
        {filteredVolunteers.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No volunteers found.</p>
        )}
      </div>
    </div>
  );
}

export default Volunteers;
