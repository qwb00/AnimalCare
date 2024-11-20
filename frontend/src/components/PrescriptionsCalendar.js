import React, { useState } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameDay, isToday, startOfWeek } from "date-fns";

function PrescriptionsCalendar({ prescriptions }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }); // Sunday as the first day
    const endDate = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endOfMonth(currentDate) });

    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const today = new Date();
    const todaysPrescriptions = prescriptions.filter(
        (prescription) =>
            prescription.dateRange.startDate <= format(today, "yyyy-MM-dd") &&
            prescription.dateRange.endDate >= format(today, "yyyy-MM-dd")
    );

    return (
        <div className="flex gap-8">
            {/* Left Column: Today's Medications */}
            <div className="w-1/4 bg-white p-4 rounded-3xl shadow-lg border border-black">
                <h2 className="text-lg font-bold mb-2 text-black">Today's Medications</h2>
                <p className="text-sm text-black mb-4">{format(today, "MMMM do, EEEE")}</p>
                {todaysPrescriptions.length > 0 ? (
                    todaysPrescriptions.map((prescription) => (
                        <div key={prescription.id} className="mb-3 flex items-center bg-light-blue p-3 rounded-md shadow-sm">
                            <img
                                src={prescription.photo}
                                alt={prescription.animalName}
                                className="w-12 h-12 rounded-full mr-3"
                            />
                            <div>
                                <p className="font-bold text-black">{prescription.animalName}</p>
                                <p className="text-sm text-black">{prescription.medication}</p>
                                <p className="text-sm text-black">
                                    {prescription.frequency.count} per {prescription.frequency.unit}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No medications to distribute today.</p>
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
                                prescription.dateRange.startDate <= formattedDate &&
                                prescription.dateRange.endDate >= formattedDate
                        );

                        return (
                            <div
                                key={formattedDate}
                                className={`border rounded-md h-28 flex flex-col justify-start items-start p-2 relative ${
                                    isToday(day) ? "border-black text-main-blue" : "bg-white text-black border-gray-300"
                                }`}
                            >
                                <p className="text-sm font-bold">{format(day, "d")}</p>
                                {dailyPrescriptions.map((prescription) => (
                                    <div
                                        key={`${prescription.id}-${prescription.animalName}`}
                                        className="text-sm bg-light-blue text-black rounded px-2 mt-1 cursor-pointer hover:bg-main-blue hover:text-white relative group"
                                    >
                                        {prescription.animalName}
                                        <div className="absolute top-8 left-0 bg-white border border-black rounded-lg shadow-md p-4 text-sm hidden group-hover:block z-10">
                                            <p className="text-black">
                                                <strong>Animal:</strong> {prescription.animalName}
                                            </p>
                                            <p className="text-black">
                                                <strong>Medication:</strong> {prescription.medication}
                                            </p>
                                            <p className="text-black">
                                                <strong>Frequency:</strong> {prescription.frequency.count} per{" "}
                                                {prescription.frequency.unit}
                                            </p>
                                        </div>
                                    </div>
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
