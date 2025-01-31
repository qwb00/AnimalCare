// Aleksander Postelga xposte00

/*
* A users reservations history component
*/

import React, { useEffect, useState } from 'react';
import API_BASE_URL from "../config";

// Status Mapping according to ReservationStatus enum
const statusMap = {
    0: { text: "Not Decided", colorClass: "bg-gray-200 text-gray-700" },
    1: { text: "Upcoming", colorClass: "bg-yellow-200 text-yellow-700" },
    2: { text: "Completed", colorClass: "bg-green-200 text-green-700" }, 
    3: { text: "Missed", colorClass: "bg-red-200 text-red-700" },        
    4: { text: "Canceled", colorClass: "bg-red-400 text-red-800" },    
};

function UserReservations({ userId }) {
    const [reservations, setReservations] = useState([]); 
    const [visibleReservations, setVisibleReservations] = useState(3); // State to control number of displayed reservations

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/reservations/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setReservations(data);
                } else {
                    console.error("Failed to fetch reservations");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        if (userId) {
            fetchReservations();
        }
    }, [userId]);

    // Shows more reservations when clicked
    const loadMoreReservations = () => {
        setVisibleReservations((prev) => prev + 3);
    };

    if (!reservations.length) return null;

    return (
        <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Your Reservations</h3>
            <div className="relative">
                {/* Slices the reservation to display only needed reservations */}
                {reservations.slice(0, visibleReservations).map((reservation, index) => {
                    {/* Format the date */}
                    const formattedDate = reservation.date
                        ? new Date(reservation.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })
                        : 'Invalid date';

                    const startTime = reservation.startTime ? reservation.startTime.slice(0, 5) : 'N/A';
                    const endTime = reservation.endTime ? reservation.endTime.slice(0, 5) : 'N/A';

                    const statusInfo = statusMap[reservation.status] || { text: "Unknown", colorClass: "bg-gray-200 text-gray-700" };

                    return (
                        <div
                            key={reservation.id}
                            className="relative flex items-start"
                            style={{ marginTop: 0 }}
                        >
                            {/* Circle with Dashed Line */}
                            <div className="flex flex-col items-center mr-4">
                                <div className="relative w-6 h-6 bg-white border-2 border-main-blue rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-main-blue rounded-full"></div>
                                </div>
                                {index < reservations.length - 1 && (
                                    <div
                                        className="w-0"
                                        style={{
                                            height: '120px',
                                            borderLeft: '2px solid transparent',
                                            backgroundImage: 'linear-gradient(to bottom, #4BD4FF 30%, transparent 50%)',
                                            backgroundSize: '2px 14px',
                                        }}
                                    ></div>
                                )}
                            </div>

                            {/* Date and Reservation Section */}
                            <div className="flex-1">
                                <div className="text-gray-500 text-sm mb-1">
                                    {formattedDate} ({startTime} - {endTime})
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">
                                            {reservation.animalName} - {reservation.animalBreed}
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <span className="text-gray-500">Status:</span>
                                        <span
                                            className={`ml-2 px-2 py-1 rounded ${statusInfo.colorClass}`}
                                        >
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {visibleReservations < reservations.length && (
                <button
                    onClick={loadMoreReservations}
                    className="mt-4 flex justify-center items-center w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                >
                    <span className="text-lg font-bold">...</span>
                </button>
            )}
        </div>
    );
}

export default UserReservations;
