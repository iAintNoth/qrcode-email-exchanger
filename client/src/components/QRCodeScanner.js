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
    <div>
      <div>
        <label>
          Searched User ID:
          <input
            type="text"
            value={searchedUserId}
            onChange={(e) => setSearchedUserId(e.target.value)}
          />
        </label>
        <button onClick={handleSearch}>Search Email</button>
      </div>
      {searchedUserEmail && (
        <div>
          <p>{`Email found: ${searchedUserEmail}`}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
