import React from "react";
import Button from "./Button"; // Импорт компонента Button

function WarningModal({ title, message, onClose, buttonText = "Close" }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // Закрытие при клике на фон
    >
      <div
        className="relative bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-out scale-105 border-2 border-red-600"
        onClick={(e) => e.stopPropagation()} // Остановка всплытия
      >
        {/* Кнопка закрытия */}
        <button
          type="button"
          className="absolute top-3 right-3 bg-main-blue rounded-full p-2"
          aria-label="Close"
          onClick={onClose}
          style={{ transform: "rotate(45deg)" }}
        >
          <img
            src="/icons/plus_white.png"
            alt="Close"
            className="w-3 h-3"
          />
        </button>

        {/* Заголовок */}
        <h3 className="text-2xl font-bold mb-6 text-center text-red-600">
          {title}
        </h3>

        {/* Сообщение */}
        <p className="text-lg mb-6 text-center text-gray-800">{message}</p>

        {/* Кнопка закрытия */}
        <div className="flex justify-center">
          <Button
            text={buttonText}
            variant="blue"
            icon="/icons/cancel_white.png"
            iconPosition="right"
            className="px-5 py-2"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default WarningModal;
