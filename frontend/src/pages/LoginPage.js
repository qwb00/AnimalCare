import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null); // Для хранения токена
  const [username, setUsername] = useState(null); // Для хранения имени пользователя
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://animalcaredb-3c73ac350ab8.herokuapp.com/api/authentication/login', {
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

    const decodedToken = jwtDecode(token);
    const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const expirationTime = decodedToken.exp * 1000; // Переводим в миллисекунды
    sessionStorage.setItem('expirationTime', expirationTime);

    const roles = decodedToken.role; // Роли пользователя, если они были добавлены

    localStorage.setItem('username', username);
    setAuthToken(token);
    setUsername(username); // Устанавливаем состояние имени пользователя

    // Перенаправление на предыдущую страницу или на главную страницу, если URL не указан
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        
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
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <Link to="/signup" className="text-blue-500 hover:underline">
          Don't have an account? Sign Up
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
