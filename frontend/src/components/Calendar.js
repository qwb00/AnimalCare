/*
  File: Calendar.js
  Description:
    - Calendar component responsible for displaying available and reserved slots for animal walks.
  
  Author:
    - Aleksei Petrishko [xpetri23]
*/

import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  format,
  addDays,
  addHours,
  isToday,
  isBefore,
  isTomorrow,
  isAfter,
  parse,
  differenceInHours,
  parseISO,
} from "date-fns";
import Button from "./Button";
import API_BASE_URL from "../config";
import { Link } from "react-router-dom";

function Calendar({}) {
  // Context for synchronizing selected animal ID and suggested animals
  const { updateSuggestedAnimals, selectedAnimalId } = useContext(AppContext);

  // Timer for showing toast notifications
  const cancelTimer = 5000; // 5 seconds

  const today = new Date();
  const tomorrow = addDays(new Date(), 1);
  const [currentWeek, setCurrentWeek] = useState(tomorrow);
  const [selectedSlotsByAnimal, setSelectedSlotsByAnimal] = useState({});
  const [animals, setAnimals] = useState([]);
  const [animalData, setAnimalData] = useState(null);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [userReservedSlots, setUserReservedSlots] = useState([]);
  const [allUserReservations, setAllUserReservations] = useState([]);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const userReservationsRef = useRef(userReservations);

  const [notification, setNotification] = useState({
    message: "",
    isSuccess: null,
  });

  const [cancelNotification, setCancelNotification] = useState({
    message: "",
    animalName: "",
    date: "",
    time: "",
    isUndo: false,
    isOpen: false,
    reservationId: null,
  });

  // Ref to handle the cancellation process outside of React's state
  const cancelProcessRef = useRef(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lastReservationDetails, setLastReservationDetails] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Maximum number of slots a user can select
  const MAX_SLOTS = 10;

  // Key to trigger data refresh in useEffect hooks
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch and set animal data on component mount
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/animals`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (response.data) {
          const animalInfo = response.data.map((animal) => ({
            id: animal.id,
            name: animal.name,
            breed: animal.breed,
            photo: animal.photo, // Add animal photo
          }));

          setAnimals(animalInfo);
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchAnimalData();
  }, []);

  // Fetch and set detailed data for the selected animal when selectedAnimalId changes
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/animals/${selectedAnimalId}`
        );
        if (response.data) {
          setAnimalData(response.data);
        } else {
          setAnimalData(null); // Reset animal data if no data is returned
        }
      } catch (error) {
        console.error("Error fetching animal data:", error);
        setAnimalData(null); // Reset animal data on error
      }
    };

    if (selectedAnimalId) {
      fetchAnimalData();
    }
  }, [selectedAnimalId]);

  // Fetch and set reserved slots for the selected animal
  const fetchReservations = async () => {
    try {
      const authToken = sessionStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/reservations`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data) {
        // Filter reservations for the selected animal and exclude those with status 4 (canceled)
        const filteredReservations = response.data.filter(
          (reservation) =>
            reservation.animalId === selectedAnimalId &&
            reservation.status !== 4
        );

        // Process reservations to determine occupied time slots
        const occupiedSlots = filteredReservations.flatMap((reservation) => {
          const reservationDate = parseISO(reservation.reservationDate);

          const startDateTime = parse(
            reservation.startTime,
            "HH:mm:ss",
            reservationDate
          );

          const endDateTime = parse(
            reservation.endTime,
            "HH:mm:ss",
            reservationDate
          );

          if (!startDateTime || !endDateTime || endDateTime <= startDateTime) {
            console.error(
              "Invalid reservation times:",
              reservation,
              "Date:",
              reservationDate,
              "Start:",
              startDateTime,
              "End:",
              endDateTime
            );
            return [];
          }

          // Split long reservations into 1-hour intervals
          const slots = [];
          let currentSlot = startDateTime;

          while (currentSlot < endDateTime) {
            const formattedDate = format(currentSlot, "yyyy-MM-dd");
            const formattedTime = format(currentSlot, "hh:mm a");
            slots.push(`${formattedDate}-${formattedTime}`);
            currentSlot = addHours(currentSlot, 1);
          }

          return slots;
        });

        setReservedSlots(occupiedSlots);
      } else {
        console.warn("No reservations found in server response.");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // Fetch and set the user's reservations for the selected animal
  const fetchUserReservations = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userID");

      if (!authToken || !userId) {
        console.warn("User not authenticated. Cannot fetch user reservations.");
        setUserReservedSlots([]); // Clear reserved slots state
        setUserReservations([]); // Clear user reservations state
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/reservations/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
        const filteredReservations = response.data.filter(
          (reservation) =>
            reservation.animalId === selectedAnimalId &&
            reservation.status !== 4 // Exclude canceled reservations
        );

        const userSlots = [];
        const detailedReservations = [];

        filteredReservations.forEach((reservation) => {
          const reservationDate = parseISO(reservation.date);

          const startDateTime = parse(
            reservation.startTime,
            "HH:mm:ss",
            reservationDate
          );

          const endDateTime = parse(
            reservation.endTime,
            "HH:mm:ss",
            reservationDate
          );

          let currentSlot = startDateTime;

          while (currentSlot < endDateTime) {
            const formattedDate = format(currentSlot, "yyyy-MM-dd");
            const formattedTime = format(currentSlot, "hh:mm a");
            const slotKey = `${formattedDate}-${formattedTime}`;

            userSlots.push(slotKey);

            detailedReservations.push({
              slotKey,
              reservationId: reservation.id,
              animalId: reservation.animalId,
              userId: userId,
              startTime: reservation.startTime,
              endTime: reservation.endTime,
              date: reservation.date,
              status: reservation.status,
            });

            currentSlot = addHours(currentSlot, 1);
          }
        });

        setUserReservedSlots(userSlots);
        setUserReservations(detailedReservations);
      } else {
        // No reservations found -> clear states
        setUserReservedSlots([]);
        setUserReservations([]);
      }
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      setUserReservedSlots([]);
      setUserReservations([]);
    }
  };

  // Re-fetch reservations and user reservations when selectedAnimalId or refreshKey changes
  useEffect(() => {
    if (selectedAnimalId) {
      fetchReservations();
      fetchUserReservations();
    } else {
      setUserReservedSlots([]);
    }
  }, [selectedAnimalId, refreshKey]);

  // Fetch all current user reservations with valid IDs
  const fetchAllUserReservations = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userID");

      if (!authToken || !userId) {
        console.warn("User not authenticated. Cannot fetch reservations.");
        return [];
      }

      const response = await axios.get(
        `${API_BASE_URL}/reservations/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
        const validReservations = response.data.filter(
          (reservation) => reservation.status !== 4 && reservation.id
        );

        return validReservations;
      }

      return [];
    } catch (error) {
      console.error("Error fetching all user reservations:", error);
      return [];
    }
  };

  // Load all user reservations when refreshKey changes
  useEffect(() => {
    const loadAllReservations = async () => {
      const reservations = await fetchAllUserReservations();
      setAllUserReservations(reservations);
    };

    loadAllReservations();
  }, [refreshKey]);

  useEffect(() => {
    userReservationsRef.current = userReservations;
  }, [userReservations]);

  // Fetch and return detailed information for a specific animal by its ID
  const fetchAnimalDetails = async (animalId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals/${animalId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching animal details:", error);
      return null;
    }
  };

  // Display a notification message with success or error status
  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setIsNotificationOpen(true);

    // Hide the notification after the specified cancelTimer duration
    setTimeout(() => {
      setIsNotificationOpen(false);
    }, cancelTimer);
  };

  // Display a cancellation-specific notification with reservation details
  const showCancelNotification = ({
    message,
    animalName,
    date,
    time,
    reservationId,
  }) => {
    setCancelNotification({
      message,
      animalName,
      date,
      time,
      reservationId,
      isUndo: false,
      isOpen: true,
    });
  };

  // Navigate to the next week by adding 7 days to the current week
  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, 7));
  };

  // Navigate to the previous week by subtracting 7 days from the current week
  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, -7));
  };

  // Generate an array of Date objects representing each day of the current week
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(currentWeek, i);
    daysOfWeek.push(day);
  }

  // Available time slots for each day (from 9:00 AM to 5:00 PM)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    const formattedTime = format(new Date(2022, 0, 1, hour), "hh:mm a");
    return formattedTime;
  });

  // Times that are currently inactive or unavailable for reservations
  const inactiveTimes = [];
  // Example of inactive times: ["11:00 AM", "03:00 PM"]

  // Open the authentication modal if the user is not authenticated, otherwise confirm the reservation
  const handleOpenModal = () => {
    const authToken = sessionStorage.getItem("token");
    if (!authToken) {
      setIsAuthModalOpen(true);
    } else {
      handleConfirmReservation();
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

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

    const formattedDate = format(parsedStartTime, "MMM dd yyyy");
    const formattedStartTime = format(parsedStartTime, "hh:mm a");
    const formattedEndTime = format(endTime, "hh:mm a");

    return {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
  };

  // Merge consecutive selected time slots to create continuous time intervals for each day
  const mergeTimeSlots = (selectedSlotsByAnimal) => {
    // Convert each selected slot into a structured format (date and start/end times)
    const slots = selectedSlotsByAnimal.map(formatTimeSlot);

    // Group slots by date to merge intervals only within the same day
    const groupedByDate = slots.reduce((acc, slot) => {
      // Initialize a list for each unique date
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {});

    const mergedSlots = []; // Array to store the final merged intervals

    Object.keys(groupedByDate).forEach((date) => {
      // Sort slots by start time to ensure correct chronological merging
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
          // Extend the current interval to include this slot if consecutive
          currentEnd = times[i].endTime;
        } else {
          // If not consecutive, save the current interval and start a new one
          mergedSlots.push({
            date,
            startTime: currentStart,
            endTime: currentEnd,
          });
          currentStart = times[i].startTime;
          currentEnd = times[i].endTime;
        }
      }

      // Add the last interval for the day to the merged slots
      mergedSlots.push({ date, startTime: currentStart, endTime: currentEnd });
    });

    return mergedSlots;
  };

  // Toggle slot selection, limiting to future slots and maximum slot count
  const handleSlotClick = (day, slot) => {
    const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
    const isFutureDate = isAfter(day, today) || isTomorrow(day);

    // If the slot is already reserved by the user, initiate cancellation
    if (userReservedSlots.includes(slotKey)) {
      handleCancelReservation(day, slot);
      return;
    }

    const currentSlots = selectedSlotsByAnimal[selectedAnimalId] || [];

    // Count how many animals already have selected slots
    const numberOfSelectedAnimals = Object.keys(selectedSlotsByAnimal).filter(
      (id) => selectedSlotsByAnimal[id] && selectedSlotsByAnimal[id].length > 0
    ).length;

    // Restrict the user to selecting slots for a maximum of 2 animals
    if (currentSlots.length === 0 && numberOfSelectedAnimals >= 2) {
      console.warn("Cannot select another animal: limit of 2 reached.");
      showNotification("You can't select more than 2 animals at once.", false);
      return;
    }

    if (currentSlots.includes(slotKey)) {
      // Deselect the slot if it's already selected
      setSelectedSlotsByAnimal((prev) => {
        const updated = { ...prev };
        updated[selectedAnimalId] = currentSlots.filter((s) => s !== slotKey);

        if (updated[selectedAnimalId].length === 0) {
          delete updated[selectedAnimalId];
        }

        return updated;
      });
    } else if (isFutureDate && currentSlots.length < MAX_SLOTS) {
      // Select the slot if it's a future date and under the maximum slot limit
      setSelectedSlotsByAnimal((prev) => {
        const updated = { ...prev };
        updated[selectedAnimalId] = [...currentSlots, slotKey];
        return updated;
      });

      // After updating selectedSlotsByAnimal, check if animal details are needed and fetch them
      (async () => {
        const alreadyHasDetails = animals.some(
          (a) =>
            a.id === selectedAnimalId && (a.age || a.weight || a.personality)
        );
        if (!alreadyHasDetails) {
          const details = await fetchAnimalDetails(selectedAnimalId);
          if (details) {
            setAnimals((prev) =>
              prev.map((a) =>
                a.id === selectedAnimalId ? { ...a, ...details } : a
              )
            );
          }
        }
      })();
    } else {
      console.warn(
        "Cannot select slot: Maximum limit reached or slot invalid."
      );
    }
  };

  // Handle the confirmation of selected reservations
  const handleConfirmReservation = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userID = sessionStorage.getItem("userID");

      if (!authToken || !userID) {
        console.error("Authentication failed. Token or userID missing.");
        showNotification("Authentication required. Please log in.", false);
        return;
      }

      // Create a copy of the current reserved slots
      let newReservedSlots = [...reservedSlots];

      let allSuccess = true;

      // Object to store fetched animal details by their ID
      let animalDetailsById = {};

      // Iterate over each animal and their selected slots
      for (const [animalId, slots] of Object.entries(selectedSlotsByAnimal)) {
        const mergedSlots = mergeTimeSlots(slots); // Merge consecutive slots

        for (const { date, startTime, endTime } of mergedSlots) {
          const reservationData = {
            userId: userID,
            animalId: animalId,
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
              fetchUserReservations(); // Refresh user reservations
              setRefreshKey((prevKey) => prevKey + 1); // Trigger data refresh

              // Add the newly reserved slots to the reservedSlots state
              let currentSlot = parse(
                startTime,
                "hh:mm a",
                parse(date, "MMM dd yyyy", new Date())
              );
              const endSlot = parse(
                endTime,
                "hh:mm a",
                parse(date, "MMM dd yyyy", new Date())
              );

              while (currentSlot < endSlot) {
                const formattedDate = format(currentSlot, "yyyy-MM-dd");
                const formattedTime = format(currentSlot, "hh:mm a");
                const slotKey = `${formattedDate}-${formattedTime}`;
                if (!newReservedSlots.includes(slotKey)) {
                  newReservedSlots.push(slotKey);
                }
                currentSlot = addHours(currentSlot, 1);
              }

              // Fetch and store animal details if not already fetched
              if (!animalDetailsById[animalId]) {
                const details = await fetchAnimalDetails(animalId);
                if (details) {
                  const animalIndex = animals.findIndex(
                    (a) => a.id === animalId
                  );
                  if (animalIndex !== -1) {
                    // Update the animals state with the fetched details
                    setAnimals((prev) => {
                      const updated = [...prev];
                      updated[animalIndex] = {
                        ...updated[animalIndex],
                        age: details.age,
                        weight: details.weight,
                        personality: details.personality,
                      };
                      return updated;
                    });
                  }
                  animalDetailsById[animalId] = details;
                } else {
                  animalDetailsById[animalId] = {};
                }
              }

              const formattedDate = format(
                parse(date, "MMM dd yyyy", new Date()),
                "EEE, MMM dd yyyy"
              );

              const currentAnimalDetails = animalDetailsById[animalId] || {};
              setLastReservationDetails({
                animalName: currentAnimalDetails?.name || "Unknown",
                animalPhoto: currentAnimalDetails?.photo || null,
                animalBreed: currentAnimalDetails?.breed || "N/A",
                animalAge: currentAnimalDetails?.age || "Unknown",
                animalWeight: currentAnimalDetails?.weight || "Unknown",
                animalPersonality:
                  currentAnimalDetails?.personality || "Not specified",
                isVaccinated: currentAnimalDetails?.isVaccinated || false,
                date: formattedDate,
                startTime,
                endTime,
              });
              showNotification("Reservation created successfully!", true);
            } else {
              console.error("Failed response:", response.data);
              showNotification(
                "Failed to create reservation. Please try again.",
                false
              );
            }

            await updateSuggestedAnimals(); // Update suggested animals in context
          } catch (error) {
            const errorMessage =
              error.response?.data?.message ||
              "Unexpected error occurred. Please try again.";
            console.error("Error sending reservation request:", errorMessage);
            if (allSuccess) {
              showNotification("All reservations created successfully!", true);
            } else {
              showNotification(
                "Some reservations failed. Please try again.",
                false
              );
            }
          }
        }

        setReservedSlots(newReservedSlots);
        setSelectedSlotsByAnimal({});
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      showNotification("Unexpected error. Please try again.", false);
    }
  };

  // Handle the cancellation of a reservation for a specific day and slot
  const handleCancelReservation = async (day, slot) => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userID = sessionStorage.getItem("userID");

      if (!authToken || !userID) {
        console.error("Missing authentication details");
        return;
      }

      const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
      const chosenSlotDate = format(day, "yyyy-MM-dd");
      const chosenSlotTime = parse(slot, "hh:mm a", new Date());

      // Attempt to find the reservation that exactly matches the slotKey
      let reservation = userReservationsRef.current.find((reservation) => {
        const reservationDate = parseISO(reservation.date);
        const startDateTime = parse(
          reservation.startTime,
          "HH:mm:ss",
          reservationDate
        );
        const formattedDate = format(startDateTime, "yyyy-MM-dd");
        const formattedTime = format(startDateTime, "hh:mm a");
        return `${formattedDate}-${formattedTime}` === slotKey;
      });

      // If no exact match is found, check if the slot falls within any reservation interval
      if (!reservation) {
        reservation = userReservations.find((reservation) => {
          const reservationDate = parseISO(reservation.date);
          const startDateTime = parse(
            reservation.startTime,
            "HH:mm:ss",
            reservationDate
          );
          const endDateTime = parse(
            reservation.endTime,
            "HH:mm:ss",
            reservationDate
          );

          // Check if the slot is within the reservation date and time range
          if (format(reservationDate, "yyyy-MM-dd") === chosenSlotDate) {
            const slotDateTime = new Date(
              `${chosenSlotDate} ${format(chosenSlotTime, "HH:mm:ss")}`
            );
            return slotDateTime > startDateTime && slotDateTime < endDateTime;
          }
          return false;
        });

        // If the slot is within a reservation longer than one hour, handle partial cancellation
        if (reservation) {
          const reservationId = reservation.reservationId;
          const formattedDate = format(day, "MMM dd yyyy");
          const formattedTime = slot;

          handleCancelWithinRange({
            reservation,
            chosenSlotDate,
            chosenSlotTime,
            authToken,
            reservationId,
            animalData,
            formattedDate,
            formattedTime,
            cancelProcessRef,
            API_BASE_URL,
            showCancelNotification,
            fetchAllUserReservations,
            updateSuggestedAnimals,
            setCancelNotification,
            setUserReservedSlots,
            setUserReservations,
            setRefreshKey,
          });
          return;
        }

        return;
      }

      if (!reservation) {
        console.error("No reservation covers this slot:", slotKey);
        return;
      }

      const reservationId = reservation.reservationId;
      const formattedDate = format(day, "MMM dd yyyy");
      const formattedTime = slot;

      cancelProcessRef.current = false;

      const reservationDate = parseISO(reservation.date);
      const startDateTime = parse(
        reservation.startTime,
        "HH:mm:ss",
        reservationDate
      );
      const endDateTime = parse(
        reservation.endTime,
        "HH:mm:ss",
        reservationDate
      );
      const hoursDiff = differenceInHours(endDateTime, startDateTime);

      let hourlySlots = [];
      if (hoursDiff > 1) {
        // Split the reservation into hourly intervals if it's longer than one hour
        let current = startDateTime;
        while (current < endDateTime) {
          const nextHour = addHours(current, 1);
          hourlySlots.push({
            start: format(current, "HH:mm:ss"),
            end: format(nextHour, "HH:mm:ss"),
            date: format(current, "yyyy-MM-dd"),
          });
          current = nextHour;
        }
      }

      showCancelNotification({
        message: "Reservation cancellation in progress...",
        animalName: animalData?.name || "Unknown Animal",
        date: formattedDate,
        time: formattedTime,
        reservationId,
      });

      // Delay the cancellation to allow for potential user undo
      setTimeout(async () => {
        if (cancelProcessRef.current) {
          return;
        }

        try {
          let response;

          if (hoursDiff > 1) {
            // If the reservation spans multiple hours, update the start time to exclude the canceled slot
            const newStartTime = format(addHours(startDateTime, 1), "HH:mm:ss");
            response = await fetch(
              `${API_BASE_URL}/reservations/${reservationId}`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify([
                  { op: "replace", path: "/startTime", value: newStartTime },
                ]),
              }
            );
          } else {
            // If the reservation is for a single hour, set its status to canceled (status 4)
            response = await fetch(
              `${API_BASE_URL}/reservations/${reservationId}`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify([
                  { op: "replace", path: "/status", value: 4 },
                ]),
              }
            );
          }

          if (!response.ok) {
            throw new Error(
              `Failed to update reservation: ${await response.text()}`
            );
          }

          setUserReservedSlots((prevSlots) =>
            prevSlots.filter((prevSlot) => prevSlot !== slotKey)
          );

          setUserReservations((prevReservations) =>
            prevReservations.filter(
              (res) =>
                !(
                  res.reservationId === reservationId && res.slotKey === slotKey
                )
            )
          );

          // Refresh all user reservations and trigger a state update
          fetchAllUserReservations();
          setRefreshKey((prevKey) => prevKey + 1);
        } catch (error) {
          console.error("Error occurred during reservation update:", error);
          showCancelNotification({
            message: "Failed to update reservation. Please try again.",
            animalName: "",
            date: "",
            time: "",
          });
        } finally {
          setCancelNotification((prev) => ({ ...prev, isOpen: false }));
          await updateSuggestedAnimals();
        }
      }, cancelTimer);
    } catch (error) {
      console.error("Error occurred during reservation cancellation:", error);
      showCancelNotification({
        message: "Failed to cancel reservation. Please try again.",
        animalName: "",
        date: "",
        time: "",
      });
    }
  };

  // Handle partial cancellation of a reservation within a specific time range
  async function handleCancelWithinRange({
    reservation,
    chosenSlotDate,
    chosenSlotTime,
    authToken,
    reservationId,
    animalData,
    formattedDate,
    formattedTime,
    cancelProcessRef,
    API_BASE_URL,
    showCancelNotification,
    fetchAllUserReservations,
    updateSuggestedAnimals,
    setCancelNotification,
    setUserReservedSlots,
    setUserReservations,
    setRefreshKey,
    cancelTimer,
  }) {
    const reservationDate = parseISO(reservation.date);
    const startDateTime = parse(
      reservation.startTime,
      "HH:mm:ss",
      reservationDate
    );
    const endDateTime = parse(reservation.endTime, "HH:mm:ss", reservationDate);

    const slotDateTime = new Date(
      `${chosenSlotDate} ${format(chosenSlotTime, "HH:mm:ss")}`
    );

    showCancelNotification({
      message: "Reservation cancellation in progress...",
      animalName: animalData?.name || "Unknown Animal",
      date: formattedDate,
      time: formattedTime,
      reservationId,
    });

    // Cancel initial reservation
    setTimeout(async () => {
      if (cancelProcessRef.current) {
        return;
      }

      try {
        // 1. Cancel the initial reservation
        let response = await fetch(
          `${API_BASE_URL}/reservations/${reservationId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json-patch+json",
            },
            body: JSON.stringify([
              { op: "replace", path: "/status", value: 4 },
            ]),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "[handleCancelWithinRange] Failed to cancel reservation:",
            errorText
          );
          throw new Error(`Failed to cancel reservation: ${errorText}`);
        }

        // 2. Calculate new reservation times
        const slotStartTime = slotDateTime;
        const slotEndTime = addHours(slotStartTime, 1);

        // Check if there are reservations before the canceled slot
        if (isAfter(slotStartTime, startDateTime)) {
          const newStartTime = format(startDateTime, "HH:mm:ss");
          const newEndTime = format(slotStartTime, "HH:mm:ss");
          const formattedReservationDate = format(startDateTime, "yyyy-MM-dd");
          const newReservationDataBefore = {
            userId: reservation.userId,
            animalId: reservation.animalId,
            reservationDate: formattedReservationDate,
            startTime: newStartTime,
            endTime: newEndTime,
          };

          // Create a new reservation before the canceled slot
          const responseBefore = await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReservationDataBefore),
          });

          if (!responseBefore.ok) {
            const errorText = await responseBefore.text();
            console.error(
              "[handleCancelWithinRange] Failed to create shortened reservation before slot:",
              errorText
            );
            throw new Error(
              `Failed to create shortened reservation before slot: ${errorText}`
            );
          }
        }

        // Check if there are reservations after the canceled slot
        if (isBefore(slotEndTime, endDateTime)) {
          const newStartTime = format(slotEndTime, "HH:mm:ss");
          const newEndTime = format(endDateTime, "HH:mm:ss");
          const formattedReservationDate = format(endDateTime, "yyyy-MM-dd");
          const newReservationDataAfter = {
            userId: reservation.userId,
            animalId: reservation.animalId,
            reservationDate: formattedReservationDate,
            startTime: newStartTime,
            endTime: newEndTime,
          };

          // Create a new reservation after the canceled slot
          const responseAfter = await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReservationDataAfter),
          });

          if (!responseAfter.ok) {
            const errorText = await responseAfter.text();
            console.error(
              "[handleCancelWithinRange] Failed to create shortened reservation after slot:",
              errorText
            );
            throw new Error(
              `Failed to create shortened reservation after slot: ${errorText}`
            );
          }
        }

        // 3. Remove the canceled slot from the user's reserved slots
        const reservationSlotsToRemove = [
          `${format(slotStartTime, "yyyy-MM-dd")}-${format(
            slotStartTime,
            "hh:mm a"
          )}`,
        ];

        setUserReservedSlots((prevSlots) => {
          const filtered = prevSlots.filter(
            (s) => !reservationSlotsToRemove.includes(s)
          );
          return filtered;
        });

        setUserReservations((prevReservations) => {
          const filtered = prevReservations.filter(
            (res) => res.reservationId !== reservationId
          );
          return filtered;
        });

        // 4. Refresh all user reservations and trigger a state update
        await fetchAllUserReservations();
        setRefreshKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error(
          "[handleCancelWithinRange] Error occurred during reservation update:",
          error
        );
        showCancelNotification({
          message: "Failed to update reservation. Please try again.",
          animalName: "",
          date: "",
          time: "",
        });
      } finally {
        setCancelNotification((prev) => ({ ...prev, isOpen: false }));
        await updateSuggestedAnimals();
        await fetchUserReservations();
      }
    }, cancelTimer);
  }

  // Handle the cancellation of a reservation from the reservations list
  const handleCancelReservationFromList = (reservationId) => {
    if (!reservationId) {
      console.error("Reservation ID is undefined. Cannot cancel reservation.");
      return;
    }

    // Find the reservation object based on the provided reservation ID
    const cancelledReservation = allUserReservations.find(
      (reservation) => reservation.id === reservationId
    );

    if (!cancelledReservation) {
      console.error(
        "Reservation not found for the provided ID:",
        reservationId
      );
      return;
    }

    cancelProcessRef.current = false;

    setCancelNotification({
      message: "Reservation cancellation in progress...",
      animalName: cancelledReservation.animalName || "Unknown Animal",
      date: cancelledReservation.date,
      time: `${cancelledReservation.startTime} - ${cancelledReservation.endTime}`,
      reservationId,
      isUndo: false,
      isOpen: true,
    });

    setTimeout(async () => {
      if (cancelProcessRef.current) {
        return;
      }

      try {
        const authToken = sessionStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/reservations/${reservationId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json-patch+json",
            },
            body: JSON.stringify([
              { op: "replace", path: "/status", value: 4 },
            ]),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to cancel reservation: ${await response.text()}`
          );
        }

        setAllUserReservations((prev) =>
          prev.filter((reservation) => reservation.id !== reservationId)
        );

        const reservationDate = parseISO(cancelledReservation.date);
        const startDateTime = parse(
          cancelledReservation.startTime,
          "HH:mm:ss",
          reservationDate
        );
        const endDateTime = parse(
          cancelledReservation.endTime,
          "HH:mm:ss",
          reservationDate
        );

        const slotsToFree = [];
        let currentSlot = startDateTime;
        while (currentSlot < endDateTime) {
          const formattedDate = format(currentSlot, "yyyy-MM-dd");
          const formattedTime = format(currentSlot, "hh:mm a");
          slotsToFree.push(`${formattedDate}-${formattedTime}`);
          currentSlot = addHours(currentSlot, 1);
        }

        setReservedSlots((prev) =>
          prev.filter((slot) => !slotsToFree.includes(slot))
        );

        setUserReservedSlots((prev) =>
          prev.filter((slot) => !slotsToFree.includes(slot))
        );

        setCancelNotification((prev) => ({ ...prev, isOpen: false }));

        // Update the suggested animals in the global context
        await updateSuggestedAnimals();
      } catch (error) {
        console.error("Error occurred during reservation cancellation:", error);
        setCancelNotification((prev) => ({
          ...prev,
          message: "Failed to cancel reservation. Please try again.",
        }));
      }
    }, cancelTimer);
  };

  const allSelectedSlots = Object.values(selectedSlotsByAnimal).flat();

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-4">
        {/* Header with week navigation */}
        <h2 className="text-xl font-semibold">
          Check <span className="text-main-blue">available</span> 1-hour slots
          for the walks with{" "}
          <span className="font-bold text-2xl text-main-blue">
            {animalData?.name}
          </span>
          <span>:</span>
        </h2>
        <div className="flex items-center bg-main-blue rounded-xl">
          {/* Hide left button if it's current week */}
          {isAfter(currentWeek, tomorrow) && (
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
            {format(addDays(currentWeek, 6), "dd MMM")}
          </span>
          <button onClick={handleNextWeek} className="text-white px-4 py-2">
            &gt;
          </button>
        </div>
      </div>
      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {daysOfWeek.map((day) => {
          const isWeekend =
            format(day, "EEE") === "Sat" || format(day, "EEE") === "Sun";

          return (
            <div
              key={day}
              className="flex flex-col items-center p-2 border border-gray-300 bg-white rounded-lg min-h-[90px]"
            >
              {/* Day of the week */}
              <div
                className={`text-lg font-semibold ${
                  isWeekend ? "text-red-500" : ""
                }`}
              >
                {format(day, "EEE")}
              </div>

              <div
                className={`text-2xl font-bold ${
                  isWeekend
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
                const currentSlots =
                  selectedSlotsByAnimal[selectedAnimalId] || [];
                const isSelected = currentSlots.includes(slotKey);
                const isReserved = reservedSlots.includes(slotKey);
                const isUserReserved = userReservedSlots.includes(slotKey);
                const isInactive =
                  inactiveTimes.includes(slot) ||
                  isPastDay ||
                  (isReserved && !isUserReserved);

                // Text button content
                const buttonText =
                  hoveredSlot === slotKey && isUserReserved ? "Cancel" : slot;

                // Style classes for button
                const generateButtonClass = (slotKey) => {
                  if (hoveredSlot === slotKey && isUserReserved) {
                    return "cursor-pointer";
                  }
                  if (isUserReserved) {
                    return "text-white cursor-pointer";
                  }
                  if (isInactive) {
                    return "bg-gray-300 text-white border border-gray-300 cursor-default";
                  }
                  if (isSelected) {
                    return "bg-white text-black border border-black";
                  }
                  return "bg-main-blue text-white border border-main-blue hover:bg-white hover:text-black hover:border-black";
                };

                return (
                  <button
                    key={slot}
                    onClick={() => !isInactive && handleSlotClick(day, slot)}
                    onMouseEnter={() =>
                      isUserReserved && setHoveredSlot(slotKey)
                    }
                    onMouseLeave={() => setHoveredSlot(null)}
                    title={isUserReserved ? "Your reservation" : ""}
                    className={`px-4 py-2 mb-2 w-full rounded-2xl transition-all duration-200 ${generateButtonClass(
                      slotKey
                    )}`}
                    style={
                      isUserReserved
                        ? {
                            backgroundColor:
                              hoveredSlot === slotKey
                                ? "#ef4444" // Bright-red (something close to red-300 in Tailwind)
                                : "#22c55e", // Greed
                            color: "white", // White text
                            border: "1px solid",
                          }
                        : {}
                    }
                  >
                    {buttonText}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* Notification Modal */}
      {isNotificationOpen && (
        <div
          className="fixed z-50 bottom-4 right-4 p-4 rounded-xl shadow-lg bg-white border-2 border-black text-black transition-all duration-300 w-72"
          onClick={() => setIsNotificationOpen(false)}
        >
          {notification.isSuccess ? (
            <>
              <h3 className="text-lg font-semibold mb-2 text-green-500">
                Reservation Confirmed
              </h3>
              {lastReservationDetails && (
                <>
                  <p className="text-sm">
                    <strong>Animal:</strong> {lastReservationDetails.animalName}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Date:</strong> {lastReservationDetails.date}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Time:</strong> {lastReservationDetails.startTime} -{" "}
                    {lastReservationDetails.endTime}
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2 text-red-500">
                Warning
              </h3>
              <p className="text-sm">{notification.message}</p>
            </>
          )}
        </div>
      )}
      {cancelNotification.isOpen && (
        <div
          className="fixed z-50 bottom-4 right-4 p-4 rounded-xl shadow-lg bg-white border-2 border-black text-black transition-all duration-300 w-72"
          onClick={() =>
            setCancelNotification((prev) => ({ ...prev, isOpen: false }))
          }
        >
          <h3 className="text-lg font-semibold mb-2 text-black">
            {`Cancelling reservation, ${cancelNotification.animalName}'s gonna miss you!`}
          </h3>
          {cancelNotification.animalName && (
            <p className="mt-2 text-sm">
              <strong>Animal:</strong> {cancelNotification.animalName}
            </p>
          )}
          {cancelNotification.date &&
            (() => {
              const dateString = cancelNotification.date;
              let parsedDate;

              if (dateString.includes("T")) {
                parsedDate = parseISO(dateString);
              } else {
                parsedDate = parse(dateString, "MMM dd yyyy", new Date());
              }

              const formattedDate = format(parsedDate, "EEE, MMM dd, yyyy");

              return (
                <p className="text-sm">
                  <strong>Date:</strong> {formattedDate}
                </p>
              );
            })()}

          {cancelNotification.time &&
            (() => {
              const timeString = cancelNotification.time;
              let formattedTime = timeString;

              if (timeString.includes("-")) {
                const [startRaw, endRaw] = timeString
                  .split("-")
                  .map((str) => str.trim());

                const startTime = parse(startRaw, "HH:mm:ss", new Date());
                const endTime = parse(endRaw, "HH:mm:ss", new Date());

                formattedTime = `${format(startTime, "hh:mm a")} - ${format(
                  endTime,
                  "hh:mm a"
                )}`;
              } else {
                const startTime = parse(timeString, "hh:mm a", new Date());
                const endTime = addHours(startTime, 1);
                formattedTime = `${format(startTime, "hh:mm a")} - ${format(
                  endTime,
                  "hh:mm a"
                )}`;
              }

              return (
                <p className="text-sm">
                  <strong>Time:</strong> {formattedTime}
                </p>
              );
            })()}

          <Button
            text="Undo"
            variant="green"
            icon="/icons/undo.png"
            iconPosition="left"
            className="mt-4 px-4 py-2 w-full"
            onClick={() => {
              cancelProcessRef.current = true;
              setCancelNotification((prev) => ({ ...prev, isOpen: false }));
            }}
          />
        </div>
      )}
      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseAuthModal}
        >
          <div
            className="relative bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-yellow-500"
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

            <h3 className="text-2xl font-bold mb-6 text-center text-yellow-500">
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
      {/* Reservation Button */}
      <div className="flex justify-start mt-4">
        <Button
          text="Create Reservation"
          variant="green"
          icon="/icons/plus_white.png"
          iconPosition="left"
          iconSize="h-4 w-4"
          onClick={handleOpenModal}
        />
      </div>
      {Object.entries(selectedSlotsByAnimal).length > 0 && (
        <>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">
              Selected Reservations:
            </h3>
          </div>

          <div className="flex flex-row gap-4 mt-4 flex-wrap">
            {Object.entries(selectedSlotsByAnimal).map(([animalId, slots]) => {
              const mergedSlots = mergeTimeSlots(slots);

              const sortedSlots = mergedSlots.sort((a, b) => {
                const dateA = parse(
                  `${a.date} ${a.startTime}`,
                  "MMM dd yyyy hh:mm a",
                  new Date()
                );
                const dateB = parse(
                  `${b.date} ${b.startTime}`,
                  "MMM dd yyyy hh:mm a",
                  new Date()
                );
                return dateA - dateB;
              });

              const animalDetails =
                animals.find((item) => item.id === animalId) || {};
              const animalPhoto = animalDetails.photo;
              const animalName = animalDetails.name || "Unknown";
              const animalBreed = animalDetails.breed || "Unknown";
              const animalAge = animalDetails.age || "Unknown";
              const animalWeight = animalDetails.weight || "Unknown";
              const animalPersonality =
                animalDetails.personality || "Not specified";

              return (
                <div
                  key={animalId}
                  className="flex flex-col justify-between mt-4 p-4 bg-white border-2 border-black rounded-xl shadow-md max-w-lg"
                >
                  <div className="flex flex-row items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">
                        {animalName}
                      </h3>
                      {animalBreed && (
                        <p className="text-base mb-1">
                          <strong>Breed:</strong> {animalBreed}
                        </p>
                      )}
                      {animalAge && (
                        <p className="text-base mb-1">
                          <strong>Age:</strong> {animalAge} years
                        </p>
                      )}
                      {animalWeight && (
                        <p className="text-base mb-1">
                          <strong>Weight:</strong> {animalWeight} kg
                        </p>
                      )}
                      {animalPersonality && (
                        <p className="text-base mb-1">
                          <strong>Personality:</strong> {animalPersonality}
                        </p>
                      )}
                      <p className="text-base mb-2 font-semibold">
                        Selected Time Slots:
                      </p>
                      <div className="flex flex-col gap-2">
                        {sortedSlots.map(({ date, startTime, endTime }) => {
                          const parsedDate = parse(
                            date,
                            "MMM dd yyyy",
                            new Date()
                          );
                          const dayOfWeek = format(parsedDate, "EEE");
                          return (
                            <div
                              key={`${date}-${startTime}-${endTime}`}
                              className="inline-block bg-main-blue text-white px-3 py-1 mr-4 rounded-xl shadow-sm text-base"
                            >
                              {`${dayOfWeek}, ${date}: ${startTime} - ${endTime}`}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {animalPhoto && (
                      <img
                        src={animalPhoto}
                        alt={animalName}
                        className="w-32 h-32 object-cover rounded-xl border-2 border-black shadow-sm"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button
                      text="Reset selection"
                      variant="white"
                      icon="/icons/cancel.png"
                      iconPosition="left"
                      onClick={() =>
                        setSelectedSlotsByAnimal((prev) => {
                          const updated = { ...prev };
                          delete updated[animalId];
                          return updated;
                        })
                      }
                      className="px-4 py-2 text-base"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {allUserReservations.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Upcoming Walks:</h3>
          {(() => {
            const grouped = Object.entries(
              allUserReservations.reduce((acc, reservation) => {
                const animalId = reservation.animalId;
                if (!acc[animalId]) {
                  acc[animalId] = [];
                }
                acc[animalId].push(reservation);
                return acc;
              }, {})
            );

            const count = grouped.length;

            return (
              <div
                className={`flex flex-wrap gap-4 ${
                  count === 3 ? "justify-between" : "justify-center"
                }`}
              >
                {grouped
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([animalId, reservations]) => {
                    const sortedReservations = reservations.sort(
                      (a, b) => new Date(a.date) - new Date(b.date)
                    );
                    const animal = animals.find(
                      (animal) => animal.id === animalId
                    );

                    return (
                      <div
                        key={animalId}
                        className="p-4 bg-white border-2 border-black rounded-xl transition-transform duration-200 max-w-sm flex-1"
                        style={{ minWidth: "250px" }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          {animal?.photo && (
                            <img
                              src={animal.photo}
                              alt={animal.name}
                              className="w-32 h-24 object-cover rounded-lg border-2 border-black mr-4"
                            />
                          )}
                          <div className="flex-1 text-left">
                            <p className="text-lg font-semibold">
                              {animal?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {animal?.breed}
                            </p>
                          </div>
                        </div>

                        {sortedReservations.map((reservation) => {
                          const reservationDate = parseISO(reservation.date);
                          const startTime = parse(
                            reservation.startTime,
                            "HH:mm:ss",
                            reservationDate
                          );
                          const endTime = parse(
                            reservation.endTime,
                            "HH:mm:ss",
                            reservationDate
                          );

                          return (
                            <div
                              key={reservation.id}
                              className="flex justify-between items-center p-4 bg-white border border-black rounded-lg mb-2"
                            >
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                  <span>
                                    {format(
                                      reservationDate,
                                      "EEE, MMM dd, yyyy"
                                    )}
                                  </span>
                                  <br />
                                  <span>
                                    {format(startTime, "hh:mm a")} -{" "}
                                    {format(endTime, "hh:mm a")}
                                  </span>
                                </p>
                              </div>
                              <Button
                                text="Cancel"
                                variant="red"
                                icon="/icons/cancel_white.png"
                                iconPosition="left"
                                onClick={() =>
                                  handleCancelReservationFromList(
                                    reservation.id
                                  )
                                }
                                className="px-3 py-2 text-sm w-24"
                                iconSize="h-4 w-4"
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default Calendar;
