// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RequestEmailForm from './components/RequestEmailForm';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/request-email" /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route
          path="/request-email"
          element={!token ? <Navigate to="/" /> : <RequestEmailForm token={token} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
