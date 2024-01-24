import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
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
    <div>
      {token ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <QRCodeScanner token={token} />
          <Notification token={token} />
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
