import React, { useState } from 'react';

function Input({ placeholder, icon, onChange, onClick }) {
  return (
    <div className="relative w-full max-w-[300px]">
      <div className="flex items-center border-2 border-black rounded-xl overflow-hidden">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-2 focus:outline-none"
          onChange={onChange} // Обрабатываем изменение текста
          onClick={onClick} // Обрабатываем клик на инпут
        />
        <img src={icon} alt="Input icon" className="h-6 w-6 mr-2" />
      </div>
    </div>
  );
}

export default Input;
