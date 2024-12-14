// Aleksander Postelga xposte00

/*
* Page for confirming new requests for animal walks
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Range } from "react-range";
import API_BASE_URL from "../config";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import Card from "../components/Card";
import { icons } from "../components/icons";
import Button from "../components/Button";
import ListItem from "../components/ListItem";

function UserReservationsConfirm() {
    const [user, setUser] = useState(null);
    const [newRequests, setNewRequests] = useState([]);
    const [filters, setFilters] = useState({
        animalName: "",
        breed: "",
        volunteerName: "",
        volunteerPhoneNumber: "",
        date: "",
        timeRange: [9, 17], // Default time range
    });
    const [viewMode, setViewMode] = useState("card");
    const [filtersVisible, setFiltersVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetches user data
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
    }, [navigate]);

    useEffect(() => {
        // Fetches new requests based on filters
        const fetchNewRequests = async () => {
            try {
                const queryParams = new URLSearchParams();
                // Filters
                if (filters.animalName) queryParams.append("AnimalName", filters.animalName);
                if (filters.breed) queryParams.append("Breed", filters.breed);
                if (filters.volunteerName) queryParams.append("VolunteerName", filters.volunteerName);
                if (filters.volunteerPhoneNumber) queryParams.append("VolunteerPhoneNumber", filters.volunteerPhoneNumber);
                if (filters.date) queryParams.append("Date", filters.date);
                if (filters.timeRange) {
                    queryParams.append("StartTime", `${filters.timeRange[0]}:00`);
                    queryParams.append("EndTime", `${filters.timeRange[1]}:00`);
                }

                const token = sessionStorage.getItem("token");
                const response = await fetch(`${API_BASE_URL}/reservations?${queryParams.toString()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch reservations");
                const data = await response.json();

                // Set all reservations with status 0 (new requests)
                setNewRequests(data.filter((reservation) => reservation.status === 0));
            } catch (error) {
                console.error("Error fetching new requests:", error);
            }
        };

        fetchNewRequests();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Approve reservation with PATCH request
    const handleApprove = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify([{ op: "replace", path: "/status", value: 1 }]), // UPCOMING
            });
            if (!response.ok) throw new Error("Failed to approve reservation");
            setNewRequests((prev) => prev.filter((reservation) => reservation.id !== id));
        } catch (error) {
            console.error("Error approving reservation:", error);
        }
    };

    // Declines reservations with PATCH request
    const handleDecline = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify([{ op: "replace", path: "/status", value: 4 }]), // DELCINED
            });
            if (!response.ok) throw new Error("Failed to decline reservation");
            setNewRequests((prev) => prev.filter((reservation) => reservation.id !== id));
        } catch (error) {
            console.error("Error declining reservation:", error);
        }
    };

    // Data not loaded yet
    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <UserHeader user={user} />
            <UserNav role={user.role} />
            <div className="w-full max-w-[1024px] mx-auto mb-14">
                <div className="flex items-center justify-between max-w-[978px]">
                    <h2 className="text-2xl font-semibold mb-6">New Requests</h2>
                    <div className="mb-4">
                        {/* Shows filters */}
                        <Button
                            text={filtersVisible ? "Hide Filters" : "Show Filters"}
                            variant="blue"
                            onClick={() => setFiltersVisible(!filtersVisible)}
                        />
                    </div>
                </div>
                {/* ListItem view Button. Author: Vorobev Mikhail xvorob01 */}
                <Button
                      icon={viewMode === "card" ? "/icons/switch_off.png" : "/icons/switch_on.png"}
                      text={`Switch to ${viewMode === "card" ? "List" : "Card"} View`}
                      variant="white"
                      onClick={() => setViewMode((prev) => (prev === "card" ? "list" : "card"))}
                    />

                {filtersVisible && (
                    <div className="p-4 bg-gray-100 rounded-lg shadow max-w-[978px] mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="animalName"
                                placeholder="Animal Name"
                                value={filters.animalName}
                                onChange={handleFilterChange}
                                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-main-blue"
                            />
                            <input
                                type="text"
                                name="breed"
                                placeholder="Breed"
                                value={filters.breed}
                                onChange={handleFilterChange}
                                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-main-blue"
                            />
                            <input
                                type="text"
                                name="volunteerName"
                                placeholder="Volunteer Name"
                                value={filters.volunteerName}
                                onChange={handleFilterChange}
                                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-main-blue"
                            />
                            <input
                                type="text"
                                name="volunteerPhoneNumber"
                                placeholder="Phone Number"
                                value={filters.volunteerPhoneNumber}
                                onChange={handleFilterChange}
                                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-main-blue"
                            />
                            <input
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                                className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-main-blue"
                            />
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Time Range: {filters.timeRange[0]}:00 - {filters.timeRange[1]}:00
                                </label>
                                <Range
                                    step={1}
                                    min={9}
                                    max={17}
                                    values={filters.timeRange}
                                    onChange={(values) => setFilters((prev) => ({ ...prev, timeRange: values }))}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            className="h-2 rounded-full"
                                            style={{
                                                // calculate the gradient based on the range values
                                                background: `linear-gradient(
                                                    to right,
                                                    #d1d5db ${((filters.timeRange[0] - 9) / (17 - 9)) * 100}%,
                                                    #4BD4FF ${((filters.timeRange[0] - 9) / (17 - 9)) * 100}%,
                                                    #4BD4FF ${((filters.timeRange[1] - 9) / (17 - 9)) * 100}%,
                                                    #d1d5db ${((filters.timeRange[1] - 9) / (17 - 9)) * 100}%
                                                )`,
                                            }}
                                        >
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({props}) => (
                                        <div
                                            {...props}
                                            className="h-4 w-4 bg-main-blue rounded-full"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-20 mt-6">
                {viewMode === "card"
                    ? newRequests.map((reservation) => (
                        <Card
                            key={reservation.id}
                            title={`Walk with ${reservation.animalName}`}
                            imageSrc={reservation.photo || icons.placeholder}
                            infoItems={[
                                { icon: icons.volunteer, label: "Volunteer", value: reservation.volunteerName },
                                { icon: icons.animal, label: "Animal", value: `${reservation.animalName} (${reservation.animalBreed})` },
                                { icon: icons.phone, label: "Phone number", value: reservation.phoneNumber },
                                { icon: icons.date, label: "Date", value: new Date(reservation.reservationDate).toLocaleDateString() },
                                { icon: icons.time, label: "Time", value: `${reservation.startTime.slice(0,5)} - ${reservation.endTime.slice(0,5)}` },
                            ]}
                            buttons={[
                                {
                                    text: "Decline",
                                    variant: "red",
                                    icon: icons.decline,
                                    onClick: () => handleDecline(reservation.id),
                                    className: "px-5 py-2 w-full",
                                },
                                {
                                    text: "Approve",
                                    variant: "blue",
                                    icon: icons.approve,
                                    onClick: () => handleApprove(reservation.id),
                                    className: "px-5 py-2 w-full",
                                },
                            ]}
                        />
                    ))
                    //ListItem view Button. Author: Vorobev Mikhail xvorob01
                    : newRequests.map((reservation) => (
                        <ListItem
                            key={reservation.id}
                            title={`Walk with ${reservation.animalName}`}
                            imageSrc={reservation.photo || icons.placeholder}
                            infoItems={[
                                { icon: icons.volunteer, label: "Volunteer", value: reservation.volunteerName },
                                { icon: icons.animal, label: "Animal", value: `${reservation.animalName} (${reservation.animalBreed})` },
                                { icon: icons.phone, label: "Phone number", value: reservation.phoneNumber },
                                { icon: icons.date, label: "Date", value: new Date(reservation.reservationDate).toLocaleDateString() },
                                { icon: icons.time, label: "Time", value: `${reservation.startTime.slice(0,5)} - ${reservation.endTime.slice(0,5)}` },
                            ]}
                            buttons={[
                                {
                                    text: "Decline",
                                    variant: "red",
                                    icon: icons.decline,
                                    onClick: () => handleDecline(reservation.id),
                                    className: "px-5 py-2 w-full",
                                },
                                {
                                    text: "Approve",
                                    variant: "blue",
                                    icon: icons.approve,
                                    onClick: () => handleApprove(reservation.id),
                                    className: "px-5 py-2 w-full",
                                },
                            ]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserReservationsConfirm;
