import React from "react";

function Button({
  text,
  variant,
  icon,
  iconPosition = "left",
  iconSize = "h-6 w-6",
  className,
  onClick,
}) {
  const baseClasses =
    "inline-flex py-2 px-4 font-semibold rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center";

  const variantClasses = (() => {
    switch (variant) {
      case "blue":
        return "bg-main-blue text-white";
      case "red":
        return "bg-red-500 text-white hover:bg-red-600";
      case "yellow":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "green":
        return "bg-green-500 text-white hover:bg-green-600";
      default:
        return "bg-white text-black border border-black hover:bg-gray-100 hover:text-gray-800";
    }
  })();

  // Handle icon presence and positioning
  const content = icon ? (
    iconPosition === "left" ? (
      <>
        <img src={icon} alt="" className={`mr-2 ${iconSize}`} /> {text}
      </>
    ) : (
      <>
        {text} <img src={icon} alt="" className={`ml-2 ${iconSize}`} />
      </>
    )
  ) : (
    <>{text}</>
  );

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
