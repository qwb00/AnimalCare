import React from "react";
import { format, endOfWeek, isSameWeek, startOfWeek } from "date-fns";

function WeekHeader({ animalName, currentWeek, onPrevWeek, onNextWeek }) {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

  const isCurrentWeek = isSameWeek(currentWeek, startOfCurrentWeek, {
    weekStartsOn: 1,
  });

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Available Reservation Slots to Walk with <span className="text-main-blue">{animalName}</span>:</h2>
      <div className="flex items-center bg-main-blue rounded-xl">
        {/* Скрываем кнопку влево, если это текущая неделя */}
        {!isCurrentWeek && (
          <button onClick={onPrevWeek} className="text-white px-4 py-2">
            &lt;
          </button>
        )}
        <span
          className="text-white px-4 py-2"
          style={{ minWidth: "150px", textAlign: "center" }}
        >
          {format(currentWeek, "dd MMM")} -{" "}
          {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), "dd MMM")}
        </span>
        <button onClick={onNextWeek} className="text-white px-4 py-2">
          &gt;
        </button>
      </div>
    </div>
  );
}

export default WeekHeader;
