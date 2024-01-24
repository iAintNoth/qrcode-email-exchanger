// QRCodeScanner.js

import React, { useState } from 'react';
import axios from 'axios';

const QRCodeScanner = ({ token }) => {
  const [searchedUserId, setSearchedUserId] = useState('');
  const [searchedUserEmail, setSearchedUserEmail] = useState('');

  const handleScan = (data) => {
    if (data) {
      setSearchedUserId(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/exchange?userId=${token}&searchedUserId=${searchedUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSearchedUserEmail(response.data.email);
    } catch (error) {
      console.error('Error searching for user:', error);
      setSearchedUserEmail('Error searching for user');
    }
  };

  return (
    <div className="qr-code-scanner-container">
      <div className="input-container">
        <label>
          Searched User ID:
          <input
            type="text"
            value={searchedUserId}
            onChange={(e) => setSearchedUserId(e.target.value)}
            className="p-2 border border-gray-300"
          />
        </label>
      </div>
      <div className="button-container">
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search Email
        </button>
      </div>
      {searchedUserEmail && (
        <div className="email-container mt-4">
          <p className="text-green-700">{`Email found: ${searchedUserEmail}`}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
