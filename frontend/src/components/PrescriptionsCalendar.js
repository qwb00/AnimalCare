import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";

function PrescriptionsCalendar({ prescriptions }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState("");

  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }); // Sunday as the first day
  const endDate = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: startDate,
    end: endOfMonth(currentDate),
  });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const unitMapping = {
    0: "day",
    1: "week",
    2: "month",
    3: "year",
  };

  const isTodaySelected = isSameDay(selectedDate, new Date());

  const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");
  const selectedDatePrescriptions = prescriptions.filter(
      (prescription) =>
          prescription.start <= formattedSelectedDate &&
          prescription.end >= formattedSelectedDate &&
          prescription.animalName.toLowerCase().includes(filter.toLowerCase())
  );

  const highlightedDates = prescriptions
      .filter((prescription) =>
          prescription.animalName.toLowerCase().includes(filter.toLowerCase())
      )
      .reduce((acc, prescription) => {
        const start = new Date(prescription.start);
        const end = new Date(prescription.end);
        const days = eachDayOfInterval({ start, end });
        days.forEach((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          if (!acc.includes(dayKey)) acc.push(dayKey);
        });
        return acc;
      }, []);

  const PrescriptionItem = ({ prescription }) => {
    return (
        <div className="mb-4 flex items-center bg-light-blue p-3 rounded-lg shadow-sm border border-black">
          <img
              src={prescription.animalPhoto}
              alt={prescription.animalName}
              className="w-20 h-20 rounded-full mr-6 border border-black"
          />
          <div>
            <p className="font-bold text-lg text-black">
              {prescription.animalName} ({prescription.animalBreed})
            </p>
            <p className="text-md text-black">{prescription.drug}</p>
            <p className="text-md text-gray-600">{prescription.description}</p>
            <p className="text-md text-gray-600">{prescription.finalDiagnosis}</p>
          </div>
        </div>
    );
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
      <div className="flex bg-white rounded-3xl shadow-lg border border-black overflow-hidden">
        {/* Left Column: Medications */}
        <div className="w-2/6 bg-white p-6 border-r border-black">
          <h2 className="text-xl font-bold mb-2 text-black">
            {isTodaySelected ? "Today's Medications" : "Medications"}
          </h2>
          <p className="text-md text-gray-500 mb-2">
            {format(selectedDate, "MMMM do, EEEE")}
          </p>
          <input
              type="text"
              placeholder="Search by animal name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full mb-4 p-3 border rounded text-black focus:outline-none focus:border-main-blue"
          />
          {selectedDatePrescriptions.length > 0 ? (
              selectedDatePrescriptions.map((prescription) => (
                  <PrescriptionItem
                      key={prescription.id}
                      prescription={prescription}
                  />
              ))
          ) : (
              <p className="text-sm text-gray-500">
                No medications to distribute on this date.
              </p>
          )}
        </div>

        {/* Right Column: Monthly Calendar */}
        <div className="w-4/6 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <button
                onClick={handlePrevMonth}
                className="px-4 py-2 text-black text-lg rounded-md hover:bg-light-blue"
            >
              &lt;
            </button>
            <h2 className="text-lg font-bold text-black">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
                onClick={handleNextMonth}
                className="px-4 py-2 text-black text-lg rounded-md hover:bg-light-blue"
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-bold">
                  {day}
                </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const formattedDate = format(day, "yyyy-MM-dd");
              const dailyPrescriptions = prescriptions.filter(
                  (prescription) =>
                      prescription.start <= formattedDate &&
                      prescription.end >= formattedDate
              );
              const animalCount = dailyPrescriptions.length;

              const isHighlighted = highlightedDates.includes(formattedDate);

              return (
                  <div
                      key={formattedDate}
                      onClick={() => setSelectedDate(day)}
                      className={`border rounded-md h-28 flex flex-col justify-between items-start p-2 cursor-pointer ${
                          isSameDay(day, selectedDate)
                              ? "bg-main-blue text-white border-black"
                              : isToday(day)
                                  ? "border-main-blue border-2 text-main-blue"
                                  : "bg-white text-red border-gray-300"
                      }`}
                  >
                    <p
                        className={`text-sm font-bold ${
                            isSameDay(day, selectedDate) ? "text-white" : "text-black"
                        }`}
                    >
                      {format(day, "d")}
                    </p>
                    {animalCount > 0 && (
                        <p
                            className={`text-xs font-semibold mt-auto ${
                                isHighlighted
                                    ? "text-main-blue"
                                    : isSameDay(day, selectedDate)
                                        ? "text-white"
                                        : "text-gray-700"
                            }`}
                        >
                          {animalCount} animal{animalCount > 1 ? "s" : ""}
                        </p>
                    )}
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}

export default PrescriptionsCalendar;
