import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Импортируем Link

function Header() {
  const [username, setUsername] = useState(null); // Состояние для имени пользователя
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);

  // Используем useEffect, чтобы проверить наличие имени пользователя в localStorage при монтировании компонента
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedUserID = sessionStorage.getItem('userID');

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('token'); // Удалите токен, если он используется
    setUsername(null);
    setUserID(null);
    navigate('/');
  };
  return (
    <header className="p-4">
      <div className="w-full max-w-[1024px] mx-auto flex justify-between items-center">
        {/* Логотип с эффектом увеличения при наведении */}
        <div className="flex items-center">
          <a href="/" className="transition transform hover:scale-105 duration-300 ease-in-out">
            <img src="/home/logo.png" alt="Logo" className="h-10" />
          </a>
        </div>

        {/* Кнопки */}
        <nav className="flex space-x-2">
          <Link to="/animals">
            <Button text="Animals" variant="white" icon="/icons/animals_button.svg" iconPosition="left" />
          </Link>
          <Link to="/reservations"> <Button text="Reservations" variant="white" icon="/icons/reservations_button.svg" iconPosition="left"/> </Link>
          {username ? (
              <div className="flex items-center space-x-2">
              <Link to={`/${userID}/general`}>
                <Button text={username} variant="blue" icon="/icons/left_arrow.svg" iconPosition="right" />
              </Link>
              <Button text="Logout" variant="white" icon="/icons/login_button_black.svg" onClick={handleLogout} />
            </div>
          ) : (
            // Кнопка "Login" для неавторизованных пользователей
            <Link to="/login">
              <Button text="Login" variant="blue" icon="/icons/login_button_white.svg" iconPosition="right" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
