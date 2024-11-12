import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../config';
import Button from '../components/Button';
import ErrorMessages from '../components/ErrorMessages';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(null); 
  const [errorData, setErrorData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorData(null);

    try {
      // Request to the server for user authentication
      const response = await fetch(`${API_BASE_URL}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

    if (!response.ok) {
      setErrorData("Wrong password or email. Please try again.");
      return;
    }

    // Extract the token from a successful response and save it to sessionStorage
    // Tokein will be sent to the server to assume that user has access rights.
    const data = await response.json();
    const token = data.token;
    sessionStorage.setItem('token', token);

    // Decode the token to get the user's name and role
    const decodedToken = jwtDecode(token);
    const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const expirationTime = decodedToken.exp * 1000; // to ms
    sessionStorage.setItem('expirationTime', expirationTime);
      

    sessionStorage.setItem('username', username);
    sessionStorage.setItem('role', role);
    setAuthToken(token);
    setUsername(username); 
    setRole(role);

    // if login is successfull, send additional request to the server to get the current user data
    const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const userID = userData.id; 
      sessionStorage.setItem('userID', userID);
      console.log("Fetched User ID:", userID);
    } else {
      console.error('Failed to fetch user ID');
    }
      // Redirect the user to the previous page or to the homepage
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

    } catch (error) {
      setErrorData(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-light-blue">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md relative">
        <Link to="/">
          <button type="button" className="absolute top-4 right-4 bg-main-blue rounded-full p-2" aria-label="Close" style={{ transform: 'rotate(45deg)' }} >
            <img src="/icons/plus_white.png" alt="Close" className="w-4 h-4" />
          </button>
        </Link>
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900">Login to your account</h2>

        {/* Component to display errors */}
        {errorData && <ErrorMessages errorData={errorData} />}

        {/* Message indicating successful login */}
        {authToken && (
          <div className="mb-4">
            <p className="text-green-500">Login successful!</p>
            <p className="text-gray-700">Token: <span className="font-mono bg-gray-100 p-1 rounded">{authToken}</span></p>
          </div>
        )}

         {/* Input field for email */}
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

        {/* Input field for password */}
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
        
        {/* Submit button for the form */}
        <Button 
          text="Sign in" 
          variant="blue" 
          className="w-full py-3 rounded-lg font-semibold"
        />

         {/* Link to the sign-up page */}
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
