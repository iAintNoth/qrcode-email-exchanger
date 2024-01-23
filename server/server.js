// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventApp';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

let secretKey = crypto.randomBytes(64).toString('hex');
app.set('secretKey', secretKey);

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token, username: user.username });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/get-email/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, secretKey);
      const user = await User.findOne({ username });
  
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json({ email: user.email });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

setInterval(() => {
  const newSecretKey = crypto.randomBytes(64).toString('hex');
  app.set('secretKey', newSecretKey);
  console.log('Secret key rotated:', newSecretKey);
  secretKey = newSecretKey;
}, 30 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
