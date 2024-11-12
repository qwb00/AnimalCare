import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  addDays,
  addHours,
  startOfWeek,
  endOfWeek,
  isToday,
  isBefore,
  isTomorrow,
  isAfter,
  parse,
  differenceInHours,
} from "date-fns";
import Button from "./Button";
import API_BASE_URL from "../config";
import { Link } from "react-router-dom";

function Calendar({ selectedAnimalId }) {
  const today = new Date();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
  const [currentWeek, setCurrentWeek] = useState(startOfThisWeek);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animalData, setAnimalData] = useState(null);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    isSuccess: null,
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const MAX_SLOTS = 10;

  // Fetch animal data from API
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/animals/${selectedAnimalId}`
        );
        if (response.data) {
          setAnimalData(response.data);
        } else {
          setAnimalData(null);
        }
      } catch (error) {
        console.error("Error fetching animal data:", error);
        setAnimalData(null);
      }
    };

    if (selectedAnimalId) {
      fetchAnimalData();
    }
  }, [selectedAnimalId]);

  // Fetch reservation data for the selected animal and filter it
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const authToken = sessionStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/reservations`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data) {
          // Filter reservations by selectedAnimalId and status
          const filteredReservations = response.data.filter(
            (reservation) =>
              reservation.animalId === selectedAnimalId &&
              reservation.status !== 4
          );

          // Format reservation dates and times for reserved slots
          const occupiedSlots = filteredReservations.map((reservation) => {
            const formattedDate = format(
              new Date(reservation.reservationDate),
              "yyyy-MM-dd"
            );
            const formattedStartTime = format(
              parse(reservation.startTime, "HH:mm:ss", new Date()),
              "hh:mm a"
            );
            return `${formattedDate}-${formattedStartTime}`;
          });

          setReservedSlots(occupiedSlots); // Update reserved slots
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    if (selectedAnimalId) {
      fetchReservations(); // Call function if selectedAnimalId exists
    }
  }, [selectedAnimalId]);

  // Notification display helper
  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setIsNotificationOpen(true);
  };

  // Week navigation
  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, 7));
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, -7));
  };

  // Toggle slot selection, limiting to future slots and max slot count
  const handleSlotClick = (day, slot) => {
    const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
    const isFutureDate = isAfter(day, today) || isTomorrow(day);

    if (selectedSlots.includes(slotKey)) {
      // Deselect slot if already selected
      setSelectedSlots((prevSelected) =>
        prevSelected.filter((s) => s !== slotKey)
      );
    } else if (isFutureDate && selectedSlots.length < MAX_SLOTS) {
      // Add slot to selection if it's a future date and below limit
      setSelectedSlots((prevSelected) => [...prevSelected, slotKey]);
    } else {
      alert("You can select a maximum of 10 future slots or limit exceeded.");
    }
  };

  // Days of the current week for display
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(currentWeek, i);
    daysOfWeek.push(day);
  }

  // Available time slots for each day (from 9:00 to 17:00)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    const formattedTime = format(new Date(2022, 0, 1, hour), "hh:mm a");
    return formattedTime;
  });

  // Format inactive time slots
  const inactiveTimes = ["11:00 AM", "03:00 PM"];

  // Modal controls for authentication and booking
  const handleOpenModal = () => {
    const authToken = sessionStorage.getItem("token");
    if (!authToken) {
      setIsAuthModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Animal image path
  const animalImagePath = animalData?.photo;

  // Format a time slot with start and end time for display
  const formatTimeSlot = (slot) => {
    const lastDashIndex = slot.lastIndexOf("-");
    const date = slot.substring(0, lastDashIndex);
    const startTime = slot.substring(lastDashIndex + 1).trim();

    const parsedStartTime = parse(
      `${date} ${startTime}`,
      "yyyy-MM-dd hh:mm a",
      new Date()
    );
    const endTime = addHours(parsedStartTime, 1); // Calculate end time by adding 1 hour

    // Format date, start, and end times
    const formattedDate = format(parsedStartTime, "MMM dd yyyy");
    const formattedStartTime = format(parsedStartTime, "hh:mm a");
    const formattedEndTime = format(endTime, "hh:mm a");

    return {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
  };

  // Merge consecutive selected time slots for continuous intervals
  const mergeTimeSlots = (selectedSlots) => {
    const slots = selectedSlots.map(formatTimeSlot);

    // Group slots by date
    const groupedByDate = slots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {});

    const mergedSlots = [];

    // Merge consecutive times for each date
    Object.keys(groupedByDate).forEach((date) => {
      const times = groupedByDate[date].sort((a, b) => {
        const parsedA = parse(
          `${date} ${a.startTime}`,
          "MMM dd yyyy hh:mm a",
          new Date()
        );
        const parsedB = parse(
          `${date} ${b.startTime}`,
          "MMM dd yyyy hh:mm a",
          new Date()
        );
        return parsedA - parsedB;
      });

      let currentStart = times[0].startTime;
      let currentEnd = times[0].endTime;

      for (let i = 1; i < times.length; i++) {
        const previousEnd = parse(
          `${date} ${currentEnd}`,
          "MMM dd yyyy hh:mm a",
          new Date()
        );
        const currentStartTime = parse(
          `${date} ${times[i].startTime}`,
          "MMM dd yyyy hh:mm a",
          new Date()
        );

        if (differenceInHours(currentStartTime, previousEnd) === 0) {
          // Extend current interval if the slot is consecutive
          currentEnd = times[i].endTime;
        } else {
          // Save the current interval and start a new one
          mergedSlots.push({
            date,
            startTime: currentStart,
            endTime: currentEnd,
          });
          currentStart = times[i].startTime;
          currentEnd = times[i].endTime;
        }
      }

      mergedSlots.push({ date, startTime: currentStart, endTime: currentEnd }); // Add last interval
    });

    return mergedSlots;
  };

  // Confirm reservation by sending selected slots to the server
  const handleConfirmReservation = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userID = sessionStorage.getItem("userID");

      const newReservedSlots = [...reservedSlots];
      let successfullyReservedSlots = [];

      // Loop through each merged time slot to create reservations
      for (const { date, startTime, endTime } of mergeTimeSlots(
        selectedSlots
      )) {
        const reservationData = {
          volunteerId: userID,
          animalId: selectedAnimalId,
          reservationDate: format(
            parse(date, "MMM dd yyyy", new Date()),
            "yyyy-MM-dd"
          ),
          startTime: format(
            parse(startTime, "hh:mm a", new Date()),
            "HH:mm:ss"
          ),
          endTime: format(parse(endTime, "hh:mm a", new Date()), "HH:mm:ss"),
        };

        try {
          // Send reservation data to API
          const response = await axios.post(
            `${API_BASE_URL}/reservations`,
            reservationData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (response.status === 201) {
            // Update reserved slots and show success notification
            const formattedDate = format(
              parse(date, "MMM dd yyyy", new Date()),
              "yyyy-MM-dd"
            );
            const formattedStartTime = format(
              parse(startTime, "hh:mm a", new Date()),
              "hh:mm a"
            );
            const newSlotKey = `${formattedDate}-${formattedStartTime}`;
            newReservedSlots.push(newSlotKey);
            successfullyReservedSlots.push(newSlotKey);

            showNotification("Reservation created successfully!", true);
          } else {
            showNotification(
              "Failed to create reservation. Please try again.",
              false
            );
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Error creating reservation. Please try again.";
          showNotification(errorMessage, false);
        }
      }

      setReservedSlots(newReservedSlots); // Update reserved slots with new slots

      // Clear successfully reserved slots from selected slots
      setSelectedSlots((prevSelectedSlots) =>
        prevSelectedSlots.filter(
          (slot) => !successfullyReservedSlots.includes(slot)
        )
      );

      handleCloseModal(); // Close reservation modal
    } catch (error) {
      showNotification("Unexpected error. Please try again.", false);
    }
  };

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-4">
        {/* Header with week navigation */}
        <h2 className="text-xl font-semibold">
          Check <span className="text-main-blue">available</span> 1-hour slots
          for the walks with{" "}
          <span className="font-bold">{animalData?.name}</span>:
        </h2>
        <div className="flex items-center bg-main-blue rounded-xl">
          {/* Hide left button if it's current week */}
          {isAfter(currentWeek, startOfThisWeek) && (
            <button onClick={handlePrevWeek} className="text-white px-4 py-2">
              &lt;
            </button>
          )}

          {/* Display current week */}
          <span
            className="text-white px-4 py-2"
            style={{ minWidth: "150px", textAlign: "center" }}
          >
            {format(currentWeek, "dd MMM")} -{" "}
            {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), "dd MMM")}
          </span>

          <button onClick={handleNextWeek} className="text-white px-4 py-2">
            &gt;
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {daysOfWeek.map((day) => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day}
              className={`flex flex-col items-center p-2 border border-gray-300 bg-white rounded-lg ${
                isCurrentDay ? "text-red-500" : ""
              } min-h-[90px]`}
            >
              <div
                className={`text-lg font-semibold ${
                  isCurrentDay ? "text-red-500" : ""
                }`}
              >
                {format(day, "EEE")}
              </div>

              <div
                className={`text-2xl font-bold ${
                  isCurrentDay
                    ? "bg-main-blue text-white rounded-full w-10 h-10 flex items-center justify-center"
                    : ""
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => {
          const isPastDay = isBefore(day, today) || isToday(day);

          return (
            <div
              key={day}
              className="flex flex-col items-center p-2 border border-gray-300 bg-white rounded-xl"
            >
              {timeSlots.map((slot) => {
                const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
                const isSelected = selectedSlots.includes(slotKey);
                const isReserved = reservedSlots.includes(slotKey);
                const isInactive =
                  inactiveTimes.includes(slot) || isPastDay || isReserved;

                return (
                  <button
                    key={slot}
                    onClick={() => !isInactive && handleSlotClick(day, slot)}
                    title={
                      isInactive
                        ? isPastDay
                          ? "Past date"
                          : isReserved
                          ? "Already reserved"
                          : "Unavailable"
                        : ""
                    }
                    className={`px-4 py-2 mb-2 w-full rounded-2xl transition-all duration-200
                      ${
                        isInactive
                          ? "!bg-gray-300 text-white !border-gray-300 cursor-default"
                          : ""
                      }
                      ${
                        isSelected
                          ? "bg-white text-black border border-black"
                          : "bg-main-blue text-white border border-main-blue"
                      }
                      ${
                        !isInactive
                          ? "hover:bg-white hover:text-black hover:border-black"
                          : ""
                      }
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Reservation Button */}
      <div className="flex justify-center mt-4">
        <Button
          text="Create Reservation"
          variant="blue"
          icon="/icons/plus_white.png"
          iconPosition="left"
          iconSize="h-4 w-4"
          onClick={handleOpenModal}
        />
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Confirm Your Reservation
            </h3>
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-lg mb-4 text-gray-700">
                  Animal: <strong>{animalData?.name}</strong>
                </p>
                <p className="text-lg mb-4 text-gray-700">
                  Selected Time Slots:
                </p>
                <div className="flex flex-col gap-2 mb-6">
                  {mergeTimeSlots(selectedSlots).map(
                    ({ date, startTime, endTime }) => (
                      <div
                        key={`${date}-${startTime}-${endTime}`}
                        className="bg-main-blue text-white px-4 py-2 rounded-lg shadow-sm text-sm"
                      >
                        {`${date}: ${startTime} - ${endTime}`}
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <img
                  src={animalImagePath}
                  alt={animalData?.name}
                  className="w-36 h-36 object-cover rounded-xl border-2 border-black shadow-lg"
                />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                text="Cancel"
                variant="white"
                icon="/icons/cancel.png"
                iconPosition="right"
                className="px-5 py-2"
                onClick={handleCloseModal}
              />
              <Button
                text="Confirm"
                variant="blue"
                icon="/icons/confirm_white.png"
                iconPosition="right"
                className="px-5 py-2"
                onClick={handleConfirmReservation}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
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

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseAuthModal}
        >
          <div
            className="relative bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-red-600"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 bg-main-blue rounded-full p-2"
              aria-label="Close"
              onClick={handleCloseAuthModal}
              style={{ transform: "rotate(45deg)" }}
            >
              <img
                src="/icons/plus_white.png"
                alt="Close"
                className="w-3 h-3"
              />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-red-600">
              Create an Account
            </h3>
            <p className="text-lg mb-6 text-center text-gray-800">
              You need to create an account to make reservations.
            </p>
            <div className="flex justify-center">
              <Link to="/signup">
                <Button
                  text="Register Now"
                  variant="blue"
                  icon="/icons/sign_up_button.png"
                  iconPosition="right"
                  className="px-5 py-2"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
