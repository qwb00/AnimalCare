import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../config';
import Button from '../components/Button'; // Импортируем компонент Button

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null); // Для хранения токена
  const [username, setUsername] = useState(null); // Для хранения имени пользователя
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const token = data.token;
      sessionStorage.setItem('token', token);
      console.log('Token:', token);

      const decodedToken = jwtDecode(token);
      const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("Role:", role);
      const expirationTime = decodedToken.exp * 1000; // Переводим в миллисекунды
      sessionStorage.setItem('expirationTime', expirationTime);
      
    console.log("Decoded Username:", username);

    sessionStorage.setItem('username', username);
    sessionStorage.setItem('role', role);
    setAuthToken(token);
    setUsername(username); // Устанавливаем состояние имени пользователя
    setRole(role);

    // Fetch user ID from the /api/users/me endpoint using the token
    const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const userID = userData.id; // Assuming 'id' is the property in the response for the user ID
      sessionStorage.setItem('userID', userID);
      console.log("Fetched User ID:", userID);
    } else {
      console.error('Failed to fetch user ID');
    }

      // Перенаправление на предыдущую страницу или на главную страницу, если URL не указан
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-light-blue">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md relative">
        {/* Кнопка закрытия */}
        <Link to="/">
          <button type="button" className="absolute top-4 right-4 bg-main-blue rounded-full p-2" aria-label="Close" style={{ transform: 'rotate(45deg)' }} >
            <img src="/icons/plus_white.png" alt="Close" className="w-4 h-4" />
          </button>
        </Link>
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Login to your account</h2>

        {/* Сообщение об ошибке */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Отображение токена при успешном логине */}
        {authToken && (
          <div className="mb-4">
            <p className="text-green-500">Login successful!</p>
            <p className="text-gray-700">Token: <span className="font-mono bg-gray-100 p-1 rounded">{authToken}</span></p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="Password"
            required
          />
        </div>

        {/* Кнопка входа через компонент Button */}
        <Button 
          text="Sign in" 
          variant="blue" 
          className="w-full py-3 rounded-lg font-semibold"
        />

        <div className="text-center mt-6 text-gray-700">
          Don't have an account?{' '}
          <Link to="/signup" className="text-main-blue font-semibold hover:underline">
            Get Started
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
