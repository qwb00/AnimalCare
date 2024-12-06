import React from "react";

function Notification({ message, isSuccess, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-4 rounded-lg ${
          isSuccess ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Notification;
