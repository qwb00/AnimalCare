import React, { useState } from "react";
import Button from "./Button";
import WarningModal from "./WarningModal";
import { format } from "date-fns";

function ReservationModal({ animalData, selectedSlots, onClose, onConfirm }) {
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const handleConfirmClick = () => {
    if (selectedSlots.length === 0) {
      setIsWarningOpen(true);
    } else {
      onConfirm();
    }
  };

  const mergeTimeSlots = (slots) => {
    return slots.map((slot) => {
      const [date, time] = slot.split("-");
      const formattedDate = format(new Date(date), "MMM dd yyyy");
      return { date: formattedDate, startTime: time, endTime: "1 hour later" };
    });
  };

  const animalImagePath = animalData?.photo;

  return (
    <>
      {/* Основное окно подтверждения */}
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
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
              <p className="text-lg mb-4 text-gray-700">Selected Time Slots:</p>
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
              {animalImagePath && (
                <img
                  src={animalImagePath}
                  alt={animalData?.name}
                  className="w-36 h-36 object-cover rounded-xl border-2 border-black shadow-lg"
                />
              )}
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              text="Cancel"
              variant="white"
              icon="/icons/cancel.png"
              iconPosition="right"
              className="px-5 py-2"
              onClick={onClose}
            />
            <Button
              text="Confirm"
              variant="blue"
              icon="/icons/confirm_white.png"
              iconPosition="right"
              className="px-5 py-2"
              onClick={handleConfirmClick}
            />
          </div>
        </div>
      </div>

      {/* Предупреждающее окно */}
      {isWarningOpen && (
        <WarningModal
          title="No Slots Selected"
          message="Please select at least one time slot to proceed."
          buttonText="Got it"
          onClose={() => setIsWarningOpen(false)}
        />
      )}
    </>
  );
}

export default ReservationModal;
