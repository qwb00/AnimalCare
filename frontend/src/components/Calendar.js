import React, { useState, useEffect } from "react";
import WeekHeader from "./WeekHeader";
import DayGrid from "./DayGrid";
import TimeSlotsGrid from "./TimeSlotsGrid";
import Notification from "./Notification";
import WarningModal from "./WarningModal";
import API_BASE_URL from "../config";
import axios from "axios";
import {
  format,
  startOfWeek,
  addDays,
  isAfter,
  isToday,
  isTomorrow,
  differenceInHours,
  isBefore,
  parse,
  addHours,
} from "date-fns";

function Calendar({ selectedAnimalId }) {
  const today = new Date();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
  const [currentWeek, setCurrentWeek] = useState(startOfThisWeek);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animalData, setAnimalData] = useState(null);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [userReservedSlots, setUserReservedSlots] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    isSuccess: null,
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const MAX_SLOTS = 10;

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/animals/${selectedAnimalId}`
        );
        if (response.data) {
          setAnimalData(response.data);
          console.log("Animal data fetched:", response.data);
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

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const authToken = sessionStorage.getItem("token");
        const userID = sessionStorage.getItem("userID");

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
              "HH:mm:ss"
            );

            console.log("Processed reservation data:", {
              id: reservation.id,
              reservationDate: formattedDate,
              startTime: formattedStartTime,
              userId: reservation.userId,
            });

            return {
              id: reservation.id,
              reservationDate: formattedDate,
              startTime: formattedStartTime,
              userId: reservation.userId,
              slotKey: `${formattedDate}-${format(
                parse(reservation.startTime, "HH:mm:ss", new Date()),
                "hh:mm a"
              )}`,
            };
          });

          setReservedSlots(occupiedSlots);
          setUserReservedSlots(
            occupiedSlots
              .filter((slot) => slot.userId === userID)
              .map((slot) => slot.slotKey)
          );
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    if (selectedAnimalId) {
      fetchReservations();
    }
  }, [selectedAnimalId]);

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setIsNotificationOpen(true);
  };

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, 7));
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, -7));
  };

  // Toggle slot selection, limiting to future slots and max slot count
  const handleSlotClick = async (day, slot) => {
    console.log("Clicked slot:", { day, slot });

    const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
    console.log("Slot key generated:", slotKey);

    const isFutureDate = isAfter(day, today);
    console.log("Is future date:", isFutureDate);

    if (!isFutureDate) {
      setWarningMessage("You cannot select past dates.");
      setIsWarningModalOpen(true);
      console.warn("Attempted to select a past date:", day);
      return;
    }

    try {
      const authToken = sessionStorage.getItem("token");
      const userID = sessionStorage.getItem("userID");
      console.log("Auth token and user ID retrieved:", { authToken, userID });

      if (!authToken || !userID) {
        console.error("Missing authentication details");
        setWarningMessage("Authentication error. Please log in.");
        setIsWarningModalOpen(true);
        return;
      }

      const reservationDate = format(day, "yyyy-MM-dd");
      console.log("Formatted reservation date:", reservationDate);

      const parsedTime = parse(slot, "hh:mm a", new Date());
      const startTime = format(parsedTime, "HH:mm:ss");
      const endTime = format(
        new Date(parsedTime.getTime() + 60 * 60 * 1000),
        "HH:mm:ss"
      );
      console.log("Start and end time formatted:", { startTime, endTime });

      if (userReservedSlots.includes(slotKey)) {
        console.log(
          "Slot reserved by current user. Initiating cancellation..."
        );

        // Найти резервацию в массиве reservedSlots
        const reservationToCancel = reservedSlots.find((reservation) => {
          // Проверяем, что reservation содержит все необходимые данные
          if (!reservation.reservationDate || !reservation.startTime) {
            console.error("Missing data in reservation:", reservation);
            return false;
          }

          const formattedDate = format(
            new Date(reservation.reservationDate),
            "yyyy-MM-dd"
          );
          const formattedStartTime = format(
            parse(reservation.startTime, "HH:mm:ss", new Date()),
            "HH:mm:ss"
          );

          console.log("Checking reservation:", {
            reservation,
            formattedDate,
            formattedStartTime,
            targetDate: reservationDate,
            targetStartTime: startTime,
          });

          return (
            reservation.userId === userID &&
            formattedDate === reservationDate &&
            formattedStartTime === startTime
          );
        });

        if (!reservationToCancel) {
          console.error("Could not find reservation to cancel.");
          setWarningMessage("Unable to find reservation to cancel.");
          setIsWarningModalOpen(true);
          return;
        }

        console.log("Reservation to cancel found:", reservationToCancel);

        // Вызов API для отмены резервации
        const response = await fetch(
          `${API_BASE_URL}/reservations/${reservationToCancel.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json-patch+json",
            },
            body: JSON.stringify([
              { op: "replace", path: "/status", value: 4 },
            ]), // 4 = CANCELED
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to cancel reservation: ${await response.text()}`
          );
        }

        console.log("Reservation canceled successfully.");
        setUserReservedSlots((prevSlots) =>
          prevSlots.filter((slot) => slot !== slotKey)
        );
        setReservedSlots((prevSlots) =>
          prevSlots.filter((slot) => slot.slotKey !== slotKey)
        );
      } else {
        // Если слот не зарезервирован, инициируем создание резервации
        console.log(
          "Slot not reserved by current user. Creating reservation..."
        );

        const reservationData = {
          userId: userID,
          animalId: selectedAnimalId,
          reservationDate,
          startTime,
          endTime,
        };

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
          console.log("Reservation created successfully:", response.data);
          setReservedSlots((prevSlots) => [...prevSlots, slotKey]);
          setUserReservedSlots((prevSlots) => [...prevSlots, slotKey]);
        } else {
          console.error(
            "Failed to create reservation. Response status:",
            response.status
          );
          setWarningMessage("Failed to create reservation. Please try again.");
          setIsWarningModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error occurred during reservation API call:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Unexpected error occurred. Please try again.";
      setWarningMessage(errorMessage);
      setIsWarningModalOpen(true);
    }
  };

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

  const inactiveTimes = ["11:00 AM", "03:00 PM"];

  const handleOpenModal = () => {
    const authToken = sessionStorage.getItem("token");
    if (!authToken) {
      setIsWarningModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false);
  };

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
  const mergeTimeSlots = (selectedSlots) => {
    // Convert each selected slot into a structured format (date and start/end times)
    const slots = selectedSlots.map(formatTimeSlot);

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

  const handleConfirmReservation = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userID = sessionStorage.getItem("userID");

      // Copy existing reserved slots and prepare to store successfully reserved ones
      const newReservedSlots = [...reservedSlots];
      let successfullyReservedSlots = [];

      // Loop through each merged time slot to send reservation requests for each interval
      for (const { date, startTime, endTime } of mergeTimeSlots(
        selectedSlots
      )) {
        const reservationData = {
          userId: userID,
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
            const formattedDate = format(
              parse(date, "MMM dd yyyy", new Date()),
              "yyyy-MM-dd"
            );
            const formattedStartTime = format(
              parse(startTime, "hh:mm a", new Date()),
              "hh:mm a"
            );
            const newSlotKey = `${formattedDate}-${formattedStartTime}`;

            // Add the newly reserved slot to `newReservedSlots` and track successful reservations
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
            "Your account is not verified. Please wait for verification.";
          showNotification(errorMessage, false);
        }
      }

      // Update reserved slots with all successfully booked slots
      setReservedSlots(newReservedSlots);

      // Remove successfully reserved slots from `selectedSlots`
      setSelectedSlots((prevSelectedSlots) =>
        prevSelectedSlots.filter(
          (slot) => !successfullyReservedSlots.includes(slot)
        )
      );

      handleCloseModal();
    } catch (error) {
      showNotification("Unexpected error. Please try again.", false);
    }
  };

  const generateColorFromId = (id) => {
    // Преобразование ID в числовое значение
    const numericId = Array.from(id.toString()).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );

    // Генерация уникального HSL
    const hue = (numericId * 137) % 360; // Используем "золотое" число для распределения
    const saturation = 90; // Высокая насыщенность
    const lightness = 50; // Средняя яркость для яркого цвета

    // Преобразуем HSL в HEX
    return hslToHex(hue, saturation, lightness);
  };

  // Функция для преобразования HSL в HEX
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      Math.round(
        255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
      );

    const r = f(0);
    const g = f(8);
    const b = f(4);

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)}`;

    return hex;
  };

  return (
    <div className="w-full py-2">
      <WeekHeader
        currentWeek={currentWeek}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        animalName={animalData?.name}
      />
      <DayGrid daysOfWeek={daysOfWeek} today={today} />
      <TimeSlotsGrid
        daysOfWeek={daysOfWeek}
        timeSlots={timeSlots}
        reservedSlots={reservedSlots}
        userReservedSlots={userReservedSlots}
        inactiveTimes={inactiveTimes}
        onSlotClick={handleSlotClick}
        animalColor={animalData ? generateColorFromId(animalData.id) : "gray"}
      />
      {isNotificationOpen && (
        <Notification
          message={notification.message}
          isSuccess={notification.isSuccess}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}
      {isWarningModalOpen && (
        <WarningModal
          title="Error"
          message={warningMessage}
          buttonText="Close"
          onClose={handleCloseWarningModal}
        />
      )}
    </div>
  );
}

export default Calendar;
