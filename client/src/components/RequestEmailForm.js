// RequestEmailForm.js

import React, { useState } from 'react';
import axios from 'axios';

function RequestEmailForm({ token }) {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestEmail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/get-email/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmail(response.data.email);
      setMessage('');
    } catch (error) {
      console.error('Error getting email:', error);
      setEmail('');
      setMessage('Error getting email.');
    }
  };
  

  return (
    <div>
      <h1>Request Email</h1>
      <label>
        User ID:
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </label>
      <br />
      <button onClick={handleRequestEmail}>Get Email</button>
      <p>Email: {email}</p>
      <p>{message}</p>
    </div>
  );
}

export default RequestEmailForm;
