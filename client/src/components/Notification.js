import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notification = ({ token }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/last-message?userId=${token}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const lastMessage = response.data.lastMessage;
  
        if (lastMessage) {
          setNotification(`L'utente ${lastMessage.username} ha deciso di scambiare email con te, la sua è ${lastMessage.email}`);
        }
      } catch (error) {
        console.error('Error fetching last message:', error);
  
        // Gestisci l'errore e imposta la notifica di errore
        setNotification(`Errore durante il recupero dell'ultimo messaggio: ${error.message}`);
      }
    };
  
    // Esegui il polling ogni tot secondi (ad esempio, ogni 5 secondi)
    const interval = setInterval(fetchLastMessage, 5000);
  
    return () => {
      clearInterval(interval);
    };
  }, [token]);

  return (
    <div>
      {notification && <p>{notification}</p>}
    </div>
  );
};

export default Notification;
