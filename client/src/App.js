// Example component using React and Tailwind CSS

import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import QRCodeScanner from './components/QRCodeScanner';
import Notification from './components/Notification';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in (retrieve token from local storage, cookies, etc.)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken) => {
    // Handle successful login and store the token (in local storage, cookies, etc.)
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    // Handle logout by removing the token
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        {token ? (
          <>
            <button
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
            <QRCodeScanner token={token} />
            <Notification token={token} />
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
};

export default App;
