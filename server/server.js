const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurazione del middleware CORS per Express
app.use(cors());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qrCodeExchange';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// Schema utente su MongoDB
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const Login = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verifica del token JWT
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Aggiungi l'endpoint per il login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Trova l'utente in MongoDB in base a username e password
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Genera il token JWT
    const token = jwt.sign({ userId: user._id }, 'secret-key');

    res.json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Aggiungi una variabile globale per archiviare gli ultimi messaggi
const lastMessages = {};

// API endpoint per lo scambio di QR code
app.get('/exchange', Login, async (req, res) => {
  const { userId, searchedUserId } = req.query;

  console.log('Received userId:', userId);
  console.log('Received searchedUserId:', searchedUserId);

  try {
    const searchedUser = await User.findById(searchedUserId);

    if (!searchedUser) {
      return res.status(404).json({ error: 'Utente cercato non trovato' });
    }

    // Aggiorna l'ultimo messaggio per l'utente cercato
    lastMessages[searchedUserId] = {
      username: req.user.username,
      email: req.user.email,
    };

    res.json({ email: searchedUser.email });
  } catch (error) {
    console.error('Errore nella ricerca dell\'utente:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/last-message', Login, async (req, res) => {
  const { userId } = req.query;

  try {
    // Trova l'utente utilizzando il token JWT
    const decoded = jwt.verify(userId.replace('Bearer ', ''), 'secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Restituisci l'ultimo messaggio per l'utente
    const lastMessage = lastMessages[decoded.userId] || null;

    // Ottieni l'username e l'email dell'utente cercato
    const searchedUserData = {
      username: user.username,
      email: user.email,
    };

    res.json({ lastMessage, searchedUserData });
  } catch (error) {
    console.error('Errore durante il recupero dell\'ultimo messaggio:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Il server è in esecuzione sulla porta ${PORT}`);
});
