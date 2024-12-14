/*
  File: BackToTop.js
  Description:
    - BackToTop component that displays a button allowing users to smoothly scroll back to the top of the page. The button becomes visible when the user scrolls down beyond 300 pixels.
  
  Author:
    - Aleksei Petrishko [xpetri23]
*/

import React, { useState, useEffect } from "react";

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button on scroll down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed z-40 text-3xl bottom-10 right-10 bg-main-blue text-white p-4 pt-2 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 w-12 h-12 flex items-center justify-center"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default BackToTop;
