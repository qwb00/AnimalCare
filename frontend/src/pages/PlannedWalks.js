// Aleksander Postelga xposte00

/*
* Page where user can manage planned walks
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

function PlannedWalks() {
    const [user, setUser] = useState(null);
    const [plannedWalks, setPlannedWalks] = useState([]);
    const [filters, setFilters] = useState({
        animalName: "",
        animalBreed: "",
        volunteerName: "",
        volunteerPhoneNumber: "",
        date: "",
        timeRange: [9, 17], // Default time range
    });
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [viewMode, setViewMode] = useState("card");
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

        // Fetches walks based on filters
        const fetchPlannedWalks = async () => {
            try {
                const queryParams = new URLSearchParams();
                // Filters
                if (filters.animalName) queryParams.append("AnimalName", filters.animalName);
                if (filters.animalBreed) queryParams.append("Breed", filters.animalBreed);
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
                const upcomingWalks = data.filter((reservation) => reservation.status === 1); // UPCOMING
                setPlannedWalks(upcomingWalks);
            } catch (error) {
                console.error("Error fetching planned walks:", error);
            }
        };
        fetchUser();
        fetchPlannedWalks();
    }, [filters]);

    // Function to handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Mark reservation as completed with PATCH request
    const handleMarkAsCompleted = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify([{ op: "replace", path: "/status", value: 2 }]), // COMPLETED
            });
            if (!response.ok) throw new Error("Failed to mark reservation as completed");
            setPlannedWalks((prev) => prev.filter((reservation) => reservation.id !== id)); // remove from the list
        } catch (error) {
            console.error("Error marking reservation as completed:", error);
        }
    };

    // Mark reservation as missed with PATCH request
    const handleMarkAsMissed = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify([{ op: "replace", path: "/status", value: 3 }]), // MISSED
            });
            if (!response.ok) throw new Error("Failed to mark reservation as missed");
            setPlannedWalks((prev) => prev.filter((reservation) => reservation.id !== id)); // Remove from the list
        } catch (error) {
            console.error("Error marking reservation as missed:", error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <Header />
            <UserHeader user={user} />
            <UserNav role={user.role} />
            <div className="w-full max-w-[1024px] mx-auto mb-14">
                <div className="flex items-center justify-between max-w-[978px]">
                    <h2 className="text-2xl font-semibold mb-6">Planned Walks</h2>
                    {/* Button to show filters */}
                    <Button
                        text={filtersVisible ? "Hide Filters" : "Show Filters"}
                        variant="blue"
                        onClick={() => setFiltersVisible(!filtersVisible)}
                    />
                </div>
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
                                name="animalBreed"
                                placeholder="Breed"
                                value={filters.animalBreed}
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
                        ? plannedWalks.map((reservation) => (
                            <Card
                                key={reservation.id}
                                title={`Walk with ${reservation.animalName}`}
                                imageSrc={reservation.photo || icons.placeholder}
                                infoItems={[
                                    {icon: icons.volunteer, label: "Volunteer", value: reservation.volunteerName },
                                    { icon: icons.animal, label: "Animal", value: `${reservation.animalName} (${reservation.animalBreed})` },
                                    { icon: icons.phone, label: "Phone number", value: reservation.phoneNumber },
                                    { icon: icons.date, label: "Date", value: new Date(reservation.reservationDate).toLocaleDateString() },
                                    { icon: icons.time, label: "Time", value: `${reservation.startTime.slice(0, 5)} - ${reservation.endTime.slice(0, 5)}`},
                                ]}
                                buttons={[
                                {
                                    text: "Missed",
                                    variant: "red",
                                    icon: icons.decline,
                                    onClick: () => handleMarkAsMissed(reservation.id),
                                    className: "px-5 py-2 w-full",
                                },
                                {
                                    text: "Completed",
                                    variant: "blue",
                                    icon: icons.approve,
                                    onClick: () => handleMarkAsCompleted(reservation.id),
                                    className: "px-5 py-2 w-full",
                                },
                                ]}
                            />
                        ))
                        :
                        plannedWalks.map((reservation) => (
                            // Mikhail Vorobev xvorob01
                            <ListItem
                                key={reservation.id}
                                title={`Walk with ${reservation.animalName}`}
                                imageSrc={reservation.photo || icons.placeholder}
                                infoItems={[
                                    { icon: icons.volunteer, label: "Volunteer", value: reservation.volunteerName },
                                    { icon: icons.animal, label: "Animal", value: `${reservation.animalName} (${reservation.animalBreed})` },
                                    { icon: icons.phone, label: "Phone number", value: reservation.phoneNumber },
                                    { icon: icons.date, label: "Date", value: new Date(reservation.reservationDate).toLocaleDateString() },
                                    { icon: icons.time, label: "Time", value: `${reservation.startTime.slice(0, 5)} - ${reservation.endTime.slice(0, 5)}` },
                                ]}
                                buttons={[
                                    {
                                        text: "Missed",
                                        variant: "red",
                                        icon: icons.decline,
                                        onClick: () => handleMarkAsMissed(reservation.id),
                                        className: "px-5 py-2 w-full",
                                    },
                                    {
                                        text: "Completed",
                                        variant: "blue",
                                        icon: icons.approve,
                                        onClick: () => handleMarkAsCompleted(reservation.id),
                                        className: "px-5 py-2 w-full",
                                    },
                                ]}
                            />
                        ))
                    }
                </div>
                {/* If no walks was found */}
                {plannedWalks.length === 0 && (
                    <p className="text-center text-gray-500 mt-4 mb-6">No planned walks found</p>
                )}
            </div>
        </div>
    );
}

export default PlannedWalks;
