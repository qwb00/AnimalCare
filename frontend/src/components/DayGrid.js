import React from "react";
import { format, isToday } from "date-fns";

function DayGrid({ daysOfWeek, today }) {
  return (
    <div className="grid grid-cols-7 gap-2 text-center mb-2">
      {daysOfWeek.map((day, index) => {
        if (!(day instanceof Date) || isNaN(day)) {
          console.error(`Invalid date at index ${index}`, day);
          return (
            <div key={index} className="text-red-500">
              Invalid date
            </div>
          );
        }

        const isCurrentDay = isToday(day);

        return (
          <div
            key={day}
            className={`flex flex-col items-center p-2 border border-gray-300 bg-white rounded-lg ${
              isCurrentDay ? "text-red-500" : ""
            } min-h-[90px]`}
          >
            <div className="text-lg font-semibold">{format(day, "EEE")}</div>
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
  );
}

export default DayGrid;
