import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const location = useLocation();

  // Check for username in sessionStorage when the component mounts
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const storedUserID = sessionStorage.getItem("userID");

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    setUsername(null);
    setUserID(null);
    navigate("/");
  };

  // Проверяем текущий путь и меняем стили кнопок
  const currentPath = location.pathname;
  const isOnAnimalsPage = currentPath.startsWith("/animals");
  const isOnReservationsPage = currentPath.startsWith("/reservations");
  const isOnUserPage = userID && currentPath.startsWith(`/${userID}`);

  // В зависимости от варианта кнопки, используем разные иконки
  const animalsIcon = isOnAnimalsPage
    ? "/icons/animals_white.png"
    : "/icons/animals_black.png";
  const reservationsIcon = isOnReservationsPage
    ? "/icons/reservations_white.png"
    : "/icons/reservations_black.png";
  const accountIcon = isOnUserPage
    ? "/icons/account_white.png"
    : "/icons/account_black.png";
  const loginIcon = username
    ? "/icons/login_button_black.svg"
    : "/icons/login_button_white.svg";

  return (
    <header className="p-4">
      <div className="w-full max-w-[1024px] mx-auto flex justify-between items-center">
        {/* Logo with hover scaling effect */}
        <div className="flex items-center">
          <a
            href="/"
            className="transition transform hover:scale-105 duration-300 ease-in-out"
          >
            <img src="/home/logo.png" alt="Logo" className="h-10" />
          </a>
        </div>

        {/* Navigation buttons */}
        <nav className="flex space-x-2">
          <Link to="/animals">
            <Button
              text="Animals"
              variant={isOnAnimalsPage ? "blue" : "white"}
              icon={animalsIcon}
              iconPosition="left"
            />
          </Link>
          <Link to="/reservations">
            <Button
              text="Reservations"
              variant={isOnReservationsPage ? "blue" : "white"}
              icon={reservationsIcon}
              iconPosition="left"
            />
          </Link>
          {username ? (
            <div className="flex items-center space-x-2">
              <Link to={`/${userID}/general`}>
                <Button
                  text={`Hey, ${username}!`}
                  variant={isOnUserPage ? "blue" : "white"}
                  icon={accountIcon}
                  iconPosition="right"
                />
              </Link>
              <Button
                text="Logout"
                variant="white"
                icon="/icons/login_button_black.svg"
                onClick={handleLogout}
              />
            </div>
          ) : (
            // "Login" button for unauthenticated users
            <Link to="/login">
              <Button
                text="Login"
                variant="blue"
                icon={loginIcon}
                iconPosition="right"
              />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
