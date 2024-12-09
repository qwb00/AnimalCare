import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
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
  parseISO,
} from "date-fns";
import Button from "./Button";
import API_BASE_URL from "../config";
import { Link } from "react-router-dom";

function Calendar({ selectedAnimalId }) {
  const { updateSuggestedAnimals } = useContext(AppContext);

  const cancelTimer = 10000; // 3 seconds

  const today = new Date();
  const tomorrow = addDays(new Date(), 1);
  const [currentWeek, setCurrentWeek] = useState(tomorrow);
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [animalData, setAnimalData] = useState(null);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [reservedSlotDetails, setReservedSlotDetails] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [userReservedSlots, setUserReservedSlots] = useState([]);
  const [allUserReservations, setAllUserReservations] = useState([]);
  const [hoveredSlot, setHoveredSlot] = useState(null);
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
    reservationId: null, // Для идентификации резервации
  });
  const cancelProcessRef = useRef(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lastReservationDetails, setLastReservationDetails] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const MAX_SLOTS = 10;
  const [refreshKey, setRefreshKey] = useState(0);

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
            photo: animal.photo, // Добавляем фото животного
          }));

          setAnimals(animalInfo);
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchAnimalData();
  }, []);

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

  useEffect(() => {
    setSelectedSlots([]);

    const fetchReservations = async () => {
      try {
        const authToken = sessionStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/reservations`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data) {
          const filteredReservations = response.data.filter(
            (reservation) =>
              reservation.animalId === selectedAnimalId &&
              reservation.status !== 4
          );

          // Обработка резерваций
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

            if (
              !startDateTime ||
              !endDateTime ||
              endDateTime <= startDateTime
            ) {
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

            // Разбиение длительных слотов на 1-часовые интервалы
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

    if (selectedAnimalId) {
      fetchReservations();
    }
  }, [selectedAnimalId, refreshKey]);

  const fetchUserReservations = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userID");

      if (!authToken || !userId) {
        console.warn("User not authenticated. Cannot fetch user reservations.");
        setUserReservedSlots([]); // Очистка состояния
        setUserReservations([]); // Очистка полного списка резерваций
        return;
      }

      console.log(
        "Fetching reservations for userId:",
        userId,
        "and animalId:",
        selectedAnimalId
      );

      const response = await axios.get(
        `${API_BASE_URL}/reservations/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
        // Фильтруем резервации по животному и статусу
        const filteredReservations = response.data.filter(
          (reservation) =>
            reservation.animalId === selectedAnimalId &&
            reservation.status !== 4 // Исключаем отменённые резервации
        );

        // Создаем списки для userReservedSlots и userReservations
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

            // Сохраняем полную информацию о каждой резервации
            detailedReservations.push({
              slotKey,
              reservationId: reservation.id,
              animalId: reservation.animalId,
              userId: sessionStorage.getItem("userID"),
              startTime: reservation.startTime,
              endTime: reservation.endTime,
              date: reservation.date,
              status: reservation.status,
            });

            currentSlot = addHours(currentSlot, 1);
          }
        });

        setUserReservedSlots(userSlots); // Обновляем слоты
        setUserReservations(detailedReservations); // Сохраняем полные данные

        console.log(
          "User reservations fetched successfully:",
          detailedReservations
        );
      } else {
        setUserReservedSlots([]);
        setUserReservations([]);
      }
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      setUserReservedSlots([]);
      setUserReservations([]);
    }
  };

  useEffect(() => {
    if (selectedAnimalId) {
      fetchUserReservations();
    } else {
      setUserReservedSlots([]);
    }
  }, [selectedAnimalId, refreshKey]);

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
        // Фильтруем только те резервации, которые активны (не отменены) и имеют `id`
        const validReservations = response.data.filter(
          (reservation) => reservation.status !== 4 && reservation.id
        );

        console.log("Filtered valid reservations:", validReservations);
        return validReservations;
      }

      return [];
    } catch (error) {
      console.error("Error fetching all user reservations:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadAllReservations = async () => {
      const reservations = await fetchAllUserReservations();
      setAllUserReservations(reservations);
    };

    loadAllReservations();
  }, [refreshKey]);

  const fetchAnimalDetails = async (animalId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/animals/${animalId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching animal details:", error);
      return null;
    }
  };

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setIsNotificationOpen(true);

    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setIsNotificationOpen(false);
    }, cancelTimer);
  };

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

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, 7));
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => addDays(prevWeek, -7));
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

  const inactiveTimes = [];
  //const inactiveTimes = ["11:00 AM", "03:00 PM"];

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

  // Обновленная функция для безопасного форматирования даты и времени
  const formatReservationDetails = (reservation) => {
    // Проверяем, существует ли reservation.date
    if (!reservation.date) {
      console.error(
        "No reservation date found for this reservation:",
        reservation
      );
      return "Invalid date"; // Возвращаем строку, если нет даты
    }

    // Попробуем парсить дату и добавить диагностику
    let reservationDate;
    try {
      reservationDate = parseISO(reservation.date); // Используем правильное поле 'date'
    } catch (error) {
      console.error("Error parsing date:", reservation.date, error);
      return "Invalid date"; // Возвращаем строку, если ошибка при парсинге
    }

    // Проверка, является ли дата валидной
    if (isNaN(reservationDate)) {
      console.error("Invalid date after parsing:", reservation.date);
      return "Invalid date"; // Возвращаем строку, если дата некорректна
    }

    const startDateTime = parse(
      reservation.startTime,
      "HH:mm:ss",
      reservationDate
    );
    const endDateTime = parse(reservation.endTime, "HH:mm:ss", reservationDate);

    const formattedDate = format(reservationDate, "MMM dd, yyyy"); // Выводим дату в формате "Dec 15, 2024"
    const formattedStartTime = format(startDateTime, "hh:mm a"); // Выводим время в формате "01:00 PM"
    const formattedEndTime = format(endDateTime, "hh:mm a"); // Выводим время в формате "03:00 PM"

    return `${formattedDate} (${formattedStartTime} - ${formattedEndTime})`;
  };

  function generateColor(id) {
    // Генерируем числовой хеш на основе ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Извлекаем базовые компоненты (HSL)
    // Повышаем насыщенность и немного уменьшаем светлоту, чтобы цвет был ярче
    let hue = Math.abs(hash % 360); // Угол цвета в градусах (0-360)
    let saturation = 70 + (hash % 20); // Повышаем насыщенность: 70-90%
    let lightness = 60 + (hash % 10); // Чуть уменьшили светлоту: 60-70%

    // Исключаем коричневые и бежевые тона
    while ((hue >= 30 && hue <= 50) || (hue >= 20 && hue <= 60)) {
      hue = (hue + 60) % 360;
    }

    // Возвращаем цвет в формате HSL
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  // Toggle slot selection, limiting to future slots and max slot count
  const handleSlotClick = (day, slot) => {
    const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
    const isFutureDate = isAfter(day, today) || isTomorrow(day);

    if (userReservedSlots.includes(slotKey)) {
      console.log("Slot reserved by user:", slotKey);

      handleCancelReservation(day, slot); // Передаем индекс в функцию отмены
      return;
    } else {
      // Обработка для добавления слотов (если требуется)
      console.log("Slot not reserved by user:", slotKey);
    }

    if (selectedSlots.includes(slotKey)) {
      // Если слот уже выбран, снимаем выбор
      console.log("Deselecting slot:", slotKey);
      setSelectedSlots((prevSelected) =>
        prevSelected.filter((s) => s !== slotKey)
      );
    } else if (isFutureDate && selectedSlots.length < MAX_SLOTS) {
      // Если слот в будущем и лимит не превышен, добавляем в выбранные
      console.log("Selecting slot:", slotKey);
      setSelectedSlots((prevSelected) => [...prevSelected, slotKey]);
    } else {
      console.warn(
        "Cannot select slot: Maximum limit reached or slot invalid."
      );
    }
  };

  const handleConfirmReservation = async () => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userID = sessionStorage.getItem("userID");

      if (!authToken || !userID) {
        console.error("Authentication failed. Token or userID missing.");
        showNotification("Authentication required. Please log in.", false);
        return;
      }

      let newReservedSlots = [...reservedSlots];
      const mergedSlots = mergeTimeSlots(selectedSlots);

      setReservedSlotDetails(mergedSlots);

      let allSuccess = true;

      for (const { date, startTime, endTime } of mergedSlots) {
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
            fetchUserReservations();
            setRefreshKey((prevKey) => prevKey + 1);

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

            // Сохраняем данные о резервации
            const animalDetails = await fetchAnimalDetails(selectedAnimalId);

            console.log("animalDetails:", animalDetails);

            const formattedDate = format(
              parse(date, "MMM dd yyyy", new Date()),
              "EEE, MMM dd yyyy"
            );

            setLastReservationDetails({
              animalName: animalDetails?.name || "Unknown",
              animalPhoto: animalDetails?.photo || null,
              animalBreed: animalDetails?.breed || "N/A",
              animalAge: animalDetails?.age || "Unknown",
              animalWeight: animalDetails?.weight || "Unknown",
              animalPersonality: animalDetails?.personality || "Not specified",
              isVaccinated: animalDetails?.isVaccinated || false,
              date: formattedDate, // Добавляем форматированную дату
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

          await updateSuggestedAnimals();
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
      setSelectedSlots([]);
    } catch (error) {
      console.error("Unexpected error:", error);
      showNotification("Unexpected error. Please try again.", false);
    }
  };

  const handleCancelReservation = async (day, slot) => {
    try {
      const authToken = sessionStorage.getItem("token");
      const userID = sessionStorage.getItem("userID");

      if (!authToken || !userID) {
        console.error("Missing authentication details");
        return;
      }

      const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
      const reservation = userReservations.find((reservation) => {
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

      if (!reservation) {
        console.error("Reservation not found for slotKey:", slotKey);
        return;
      }

      const reservationId = reservation.reservationId;
      const formattedDate = format(day, "MMM dd yyyy");
      const formattedTime = slot;

      // Сбрасываем флаг отмены
      cancelProcessRef.current = false;

      // Показываем уведомление
      showCancelNotification({
        message: "Reservation cancellation in progress...",
        animalName: animalData?.name || "Unknown Animal",
        date: formattedDate,
        time: formattedTime,
        reservationId,
      });

      // Таймер для выполнения запроса и скрытия уведомления
      setTimeout(async () => {
        if (cancelProcessRef.current) {
          console.log("Cancellation undone by user.");
          return;
        }

        try {
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

          console.log("Reservation cancelled successfully.");

          // Удаляем только выбранный слот из состояний
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

          fetchAllUserReservations();
          setRefreshKey((prevKey) => prevKey + 1);
        } catch (error) {
          console.error(
            "Error occurred during reservation cancellation:",
            error
          );
          showCancelNotification({
            message: "Failed to cancel reservation. Please try again.",
            animalName: "",
            date: "",
            time: "",
          });
        } finally {
          // Скрываем уведомление
          setCancelNotification((prev) => ({ ...prev, isOpen: false }));
        }
      }, cancelTimer); // Таймаут для выполнения запроса и скрытия уведомления

      await updateSuggestedAnimals();
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

  const handleCancelReservationFromList = (reservationId) => {
    if (!reservationId) {
      console.error("Reservation ID is undefined. Cannot cancel reservation.");
      return;
    }

    // Ищем резервацию по ID
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

    // Устанавливаем флаг для отмены
    cancelProcessRef.current = false;

    // Показываем предупреждающее уведомление
    setCancelNotification({
      message: "Reservation cancellation in progress...",
      animalName: cancelledReservation.animalName || "Unknown Animal",
      date: cancelledReservation.date,
      time: `${cancelledReservation.startTime} - ${cancelledReservation.endTime}`,
      reservationId,
      isUndo: false,
      isOpen: true,
    });

    // Устанавливаем таймер для отправки запроса
    setTimeout(async () => {
      if (cancelProcessRef.current) {
        console.log("Cancellation undone by user.");
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

        console.log("Reservation cancelled successfully for:", reservationId);

        // Обновляем список всех резерваций пользователя
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

        // Генерируем ключи слотов, которые нужно удалить
        const slotsToFree = [];
        let currentSlot = startDateTime;
        while (currentSlot < endDateTime) {
          const formattedDate = format(currentSlot, "yyyy-MM-dd");
          const formattedTime = format(currentSlot, "hh:mm a");
          slotsToFree.push(`${formattedDate}-${formattedTime}`);
          currentSlot = addHours(currentSlot, 1);
        }

        // Удаляем слоты из состояний reservedSlots и userReservedSlots
        setReservedSlots((prev) =>
          prev.filter((slot) => !slotsToFree.includes(slot))
        );
        setUserReservedSlots((prev) =>
          prev.filter((slot) => !slotsToFree.includes(slot))
        );

        // Скрываем уведомление
        setCancelNotification((prev) => ({ ...prev, isOpen: false }));

        await updateSuggestedAnimals();
      } catch (error) {
        console.error("Error occurred during reservation cancellation:", error);
        setCancelNotification((prev) => ({
          ...prev,
          message: "Failed to cancel reservation. Please try again.",
        }));
      }
    }, cancelTimer); // Таймаут перед отправкой запроса
  };

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-4">
        {/* Header with week navigation */}
        <h2 className="text-xl font-semibold">
          Check <span className="text-main-blue">available</span> 1-hour slots
          for the walks with{" "}
          <span
            className="font-bold text-2xl"
            style={{ color: generateColor(selectedAnimalId) }}
          >
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
              {/* Название дня недели */}
              <div
                className={`text-lg font-semibold ${
                  isWeekend ? "text-red-500" : ""
                }`}
              >
                {format(day, "EEE")}
              </div>

              {/* Число дня */}
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
                const isSelected = selectedSlots.includes(slotKey);
                const isReserved = reservedSlots.includes(slotKey);
                const isUserReserved = userReservedSlots.includes(slotKey);
                const isInactive =
                  inactiveTimes.includes(slot) ||
                  isPastDay ||
                  (isReserved && !isUserReserved);

                // Генерация текста кнопки
                const buttonText =
                  hoveredSlot === slotKey && isUserReserved ? "Cancel" : slot;

                // Генерация класса для кнопки
                const generateButtonClass = (slotKey) => {
                  if (hoveredSlot === slotKey && isUserReserved) {
                    return "cursor-pointer"; // Убираем цветовые стили, чтобы их регулировать через инлайн стили
                  }
                  if (isUserReserved) {
                    return "text-white cursor-pointer"; // Белый текст для зарезервированных слотов
                  }
                  if (isInactive) {
                    return "bg-gray-300 text-white border border-gray-300 cursor-default"; // Недоступные слоты
                  }
                  if (isSelected) {
                    return "bg-white text-black border border-black"; // Выбранные слоты
                  }
                  return "bg-main-blue text-white border border-main-blue hover:bg-white hover:text-black hover:border-black"; // Доступные слоты
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
                                ? "#ef4444" // Светло-красный (примерно соответствует Tailwind red-300)
                                : generateColor(selectedAnimalId), // Цвет животного
                            color: "white", // Белый текст
                            border: "1px solid", // Красноватая граница
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
      {isNotificationOpen && notification.isSuccess && (
        <div
          className="fixed z-50 bottom-4 right-4 p-4 rounded-xl shadow-lg bg-white border-2 border-black text-black transition-all duration-300 w-72"
          onClick={() => setIsNotificationOpen(false)}
        >
          <h3 className="text-lg font-semibold mb-2 text-green-500">
            Reservation Confirmed
          </h3>
          {lastReservationDetails && (
            <>
              <p className="text-sm">
                <strong>Animal:</strong> {lastReservationDetails.animalName}
              </p>
              <p className="text-sm mb-2">
                <strong>Date & Time:</strong> {lastReservationDetails.date},{" "}
                {lastReservationDetails.startTime} -{" "}
                {lastReservationDetails.endTime}
              </p>
            </>
          )}
          <p className="text-sm">This message will disappear soon.</p>
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
          {cancelNotification.date && (
            <p className="text-sm">
              <strong>Date:</strong> {cancelNotification.date}
            </p>
          )}
          {cancelNotification.time &&
            (() => {
              const timeRange = cancelNotification.time.split(" - ");
              let formattedTime = cancelNotification.time;

              if (timeRange.length === 2) {
                // Предполагаем, что timeRange содержит ISO-строки дат (например, "2024-12-16T12:00:00" - "2024-12-16T13:00:00")
                const start = parseISO(timeRange[0]);
                const end = parseISO(timeRange[1]);

                if (!isNaN(start) && !isNaN(end)) {
                  // Форматируем в удобочитаемый формат
                  // Например: "Mon, Dec 16, 2024 12:00 PM - 01:00 PM"
                  formattedTime = `${format(
                    start,
                    "EEE, MMM dd, yyyy h:mm a"
                  )} - ${format(end, "h:mm a")}`;
                }
              }

              return (
                <p className="text-sm">
                  <strong>Date & Time:</strong> {formattedTime}
                </p>
              );
            })()}

          <Button
            text="Undo"
            variant="green"
            icon="/icons/undo.png" // Иконка undo
            iconPosition="left"
            className="mt-4 px-4 py-2 w-full" // Полная ширина для кнопки
            onClick={() => {
              cancelProcessRef.current = true; // Устанавливаем флаг отмены
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

      {/* Reservation Button */}
      <div className="flex justify-start mt-4">
        <Button
          text="Create Reservation"
          variant="green"
          icon="/icons/plus_white.png"
          iconPosition="left"
          iconSize="h-4 w-4"
          onClick={handleConfirmReservation}
        />
      </div>

      {mergeTimeSlots(selectedSlots).length > 0 && (
        <div className="mt-4 p-4 bg-white border-2 border-black rounded-xl shadow-md max-w-lg">
          <h3 className="text-lg font-semibold mb-3">
            Selected Reservation Details
          </h3>
          <div className="flex flex-row items-start gap-4">
            <div className="flex-1">
              <p className="text-base mb-1">
                <strong>Animal:</strong> {animalData?.name}
              </p>
              {animalData?.breed && (
                <p className="text-base mb-1">
                  <strong>Breed:</strong> {animalData.breed}
                </p>
              )}
              {animalData?.age && (
                <p className="text-base mb-1">
                  <strong>Age:</strong> {animalData.age} years
                </p>
              )}
              {animalData?.weight && (
                <p className="text-base mb-1">
                  <strong>Weight:</strong> {animalData.weight} kg
                </p>
              )}
              {animalData?.personality && (
                <p className="text-base mb-1">
                  <strong>Personality:</strong> {animalData.personality}
                </p>
              )}
              <p className="text-base mb-2 font-semibold">
                Selected Time Slots:
              </p>
              <div className="flex flex-col gap-2">
                {mergeTimeSlots(selectedSlots).map(
                  ({ date, startTime, endTime }) => {
                    // Парсим дату, чтобы можно было получить день недели
                    const parsedDate = parse(date, "MMM dd yyyy", new Date());
                    const dayOfWeek = format(parsedDate, "EEE"); // Например: Mon, Tue, Wed...

                    return (
                      <div
                        key={`${date}-${startTime}-${endTime}`}
                        className="inline-block bg-main-blue text-white px-3 py-1 mr-4 rounded-xl shadow-sm text-base"
                      >
                        {`${dayOfWeek}, ${date}: ${startTime} - ${endTime}`}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            {animalImagePath && (
              <img
                src={animalImagePath}
                alt={animalData?.name}
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
              onClick={() => setSelectedSlots([])}
              className="px-4 py-2 text-base"
            />
          </div>
        </div>
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
                        className="p-4 bg-white border-2 border-black rounded-lg transition-transform duration-200 ease-out hover:scale-[1.02] max-w-sm flex-1"
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
