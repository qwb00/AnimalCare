import React from "react";
import { format, isToday, isBefore } from "date-fns";

function TimeSlotsGrid({
  daysOfWeek,
  timeSlots,
  reservedSlots,
  userReservedSlots,
  inactiveTimes,
  animalColor,
  onSlotClick,
}) {
  const today = new Date();

  console.log("Animal color being used:", `"${animalColor}"`);

  return (
    <div className="grid grid-cols-7 gap-2">
      {daysOfWeek.map((day) => {
        const isPastDay = isBefore(day, today) || isToday(day);

        return (
          <div
            key={format(day, "yyyy-MM-dd")}
            className="flex flex-col items-center p-2 border border-gray-300 bg-white rounded-xl"
          >
            {timeSlots.map((slot) => {
              const slotKey = `${format(day, "yyyy-MM-dd")}-${slot}`;
              const isSelectedByUser = userReservedSlots.includes(slotKey);
              const isReserved = reservedSlots.includes(slotKey);
              const isInactive = inactiveTimes.includes(slot) || isPastDay;
              const isUserReservedAndInactive =
                isSelectedByUser && (isInactive || isPastDay);

              // Определяем стили для кнопки
              const buttonStyle = isUserReservedAndInactive
                ? {
                    backgroundColor: "#d1d5db",
                    border: "1px solid #d1d5db",
                    color: "white",
                    cursor: "default",
                  }
                : isSelectedByUser
                ? {
                    backgroundColor: animalColor,
                    border: "1px solid",
                    borderColor: animalColor,
                    color: "white",
                  }
                : {};

              const hoverStyle = isSelectedByUser
                ? {
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid black",
                  }
                : {};

              // Определяем классы для кнопки
              let buttonClass =
                "px-4 py-2 mb-2 w-full rounded-2xl transition-all duration-200";

              if (isUserReservedAndInactive) {
                buttonClass +=
                  " bg-gray-300 text-white border border-gray-300 cursor-default";
              } else if (isSelectedByUser) {
                buttonClass +=
                  " hover:border-black hover:border hover:bg-white hover:text-black";
              } else if (isInactive) {
                buttonClass +=
                  " bg-gray-300 text-white border border-gray-300 cursor-default";
              } else if (isReserved) {
                buttonClass +=
                  " bg-gray-300 text-white border border-gray-300 cursor-default";
              } else {
                buttonClass +=
                  " bg-main-blue text-white border border-main-blue hover:bg-white hover:text-black hover:border-black";
              }

              // Определяем title для кнопки
              let buttonTitle = "";
              if (isUserReservedAndInactive) {
                buttonTitle = "Unavailable";
              } else if (isSelectedByUser) {
                buttonTitle = "Cancel";
              } else if (!isInactive && !isReserved) {
                buttonTitle = "Reserve";
              } else if (isReserved) {
                buttonTitle = "Already reserved";
              } else if (isInactive) {
                buttonTitle = isPastDay ? "Past date" : "Unavailable";
              }

              return (
                <button
                  key={slot}
                  onClick={() =>
                    !isInactive &&
                    !isUserReservedAndInactive &&
                    onSlotClick(day, slot)
                  }
                  title={buttonTitle}
                  className={buttonClass}
                  style={buttonStyle} // Применяем инлайн стили
                  onMouseEnter={(e) => {
                    if (isSelectedByUser && !isUserReservedAndInactive) {
                      Object.assign(e.target.style, hoverStyle);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isSelectedByUser && !isUserReservedAndInactive) {
                      Object.assign(e.target.style, buttonStyle);
                    }
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default TimeSlotsGrid;
