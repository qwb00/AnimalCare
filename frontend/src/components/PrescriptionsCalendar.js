import React, { useState, useRef } from "react";
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
      prescription.end >= formattedSelectedDate
  );

  // Define the PrescriptionItem component inside PrescriptionsCalendar
  const PrescriptionItem = ({ prescription }) => {
    const [showAbove, setShowAbove] = useState(false);
    const itemRef = useRef(null);

    const handleMouseEnter = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        const viewportHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const popupHeight = 150; // Adjust this to the approximate height of your popup

        if (spaceBelow < popupHeight) {
          setShowAbove(true);
        } else {
          setShowAbove(false);
        }
      }
    };

    return (
      <div
        key={`${prescription.id}-${prescription.animalName}`}
        ref={itemRef}
        onMouseEnter={handleMouseEnter}
        className="text-sm bg-light-blue text-black rounded px-2 mt-1 cursor-pointer hover:bg-main-blue hover:text-white relative group"
      >
        {prescription.animalName}
        <div
          className={`absolute ${
            showAbove ? "bottom-full mb-2" : "top-full mt-2"
          } left-0 bg-white border border-black rounded-lg shadow-md p-4 text-sm hidden group-hover:block z-10`}
        >
          <p className="text-black">
            <strong>Animal:</strong> {prescription.animalName}
          </p>
          <p className="text-black">
            <strong>Medication:</strong> {prescription.drug}
          </p>
          <p className="text-black">
            <strong>Frequency:</strong> {prescription.count} per{" "}
            {unitMapping[prescription.unit]}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-8">
      {/* Left Column: Medications */}
      <div className="w-1/4 bg-white p-4 rounded-3xl shadow-lg border border-black">
        <h2 className="text-lg font-bold mb-2 text-black">
          {isTodaySelected ? "Today's Medications" : "Medications"}
        </h2>
        <p className="text-sm text-black mb-4">
          {format(selectedDate, "MMMM do, EEEE")}
        </p>
        {selectedDatePrescriptions.length > 0 ? (
          selectedDatePrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="mb-3 flex items-center bg-light-blue p-3 rounded-md shadow-sm"
            >
              <img
                src={prescription.animalPhoto}
                alt={prescription.animalName}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-bold text-black">
                  {prescription.animalName}
                </p>
                <p className="text-sm text-black">{prescription.drug}</p>
                <p className="text-sm text-black">
                  {prescription.count} per {unitMapping[prescription.unit]}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No medications to distribute on this date.
          </p>
        )}
      </div>

      {/* Right Column: Monthly Calendar */}
      <div className="w-3/4 bg-white p-4 rounded-3xl shadow-lg border border-black">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="px-2 py-1 text-black text-lg rounded-md hover:bg-light-blue"
          >
            &lt;
          </button>
          <h2 className="text-lg font-bold text-black mx-4">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={handleNextMonth}
            className="px-2 py-1 text-black text-lg rounded-md hover:bg-light-blue"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const formattedDate = format(day, "yyyy-MM-dd");
            const dailyPrescriptions = prescriptions.filter(
              (prescription) =>
                prescription.start <= formattedDate &&
                prescription.end >= formattedDate
            );

            return (
              <div
                key={formattedDate}
                onClick={() => setSelectedDate(day)}
                className={`border rounded-md h-28 flex flex-col justify-start items-start p-2 relative cursor-pointer ${
                  isSameDay(day, selectedDate)
                    ? "bg-main-blue text-white border-black"
                    : isToday(day)
                    ? "border-black text-main-blue"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    isSameDay(day, selectedDate) ? "text-white" : "text-black"
                  }`}
                >
                  {format(day, "d")}
                </p>
                {dailyPrescriptions.map((prescription) => (
                  <PrescriptionItem
                    key={`${prescription.id}-${prescription.animalName}`}
                    prescription={prescription}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PrescriptionsCalendar;
