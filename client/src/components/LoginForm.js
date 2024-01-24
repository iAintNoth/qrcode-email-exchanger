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
    <div>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
