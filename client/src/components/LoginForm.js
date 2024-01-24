import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Make API call to login endpoint
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, { username, password });
  
      // Handle successful login
      onLogin(response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="mb-2">
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-1" />
      </label>
      <label className="mb-2">
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-1" />
      </label>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </div>
  );
};

export default LoginForm;
