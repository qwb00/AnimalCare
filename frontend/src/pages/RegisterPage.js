import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import Button from '../components/Button'; // Импортируем компонент Button

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    const roles = ["Volunteer"];
    try {
      const response = await fetch(`${API_BASE_URL}/authentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, username, phoneNumber, roles }),
      });

      if (!response.ok) throw new Error('Registration failed');

      alert('Registration successful! Please log in.');
      navigate('/login');

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-light-blue">
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm relative">
        {/* Кнопка закрытия */}
        <Link to="/">
          <button type="button" className="absolute top-3 right-3 bg-main-blue rounded-full p-2" aria-label="Close" style={{ transform: 'rotate(45deg)' }}>
            <img src="/icons/plus_white.png" alt="Close" className="w-3 h-3" />
          </button>
        </Link>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">Sign Up</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <div className="mb-3">
          <label className="block text-gray-700 mb-1 text-sm font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="First Name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="Last Name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="Username"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="Password"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1 text-sm font-medium">Phone Number</label>
          <input
            type="phone"
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main-blue"
            placeholder="Phone Number"
            required
          />
        </div>

        {/* Кнопка регистрации через компонент Button */}
        <Button 
          text="Sign Up" 
          variant="blue" 
          className="w-full py-2 rounded-lg text-sm font-semibold"
        />

        <div className="text-center mt-4 text-gray-700 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-main-blue font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
