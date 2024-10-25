import React from 'react';

function Button({ text, variant, icon, iconPosition = 'left', iconSize = 'h-6 w-6', className, onClick }) {
  const baseClasses = "inline-flex py-2 px-4 font-semibold rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center";
  
  const variantClasses =
    variant === 'blue'
      ? 'bg-main-blue text-white'
      : 'bg-white text-black border border-black hover:bg-gray-100 hover:text-gray-800';

  const content = icon && iconPosition === 'left'
    ? (<><img src={icon} alt="" className={`mr-2 ${iconSize}`} /> {text}</>)
    : (<>{text} <img src={icon} alt="" className={`ml-2 ${iconSize}`} /></>);

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default Button;
