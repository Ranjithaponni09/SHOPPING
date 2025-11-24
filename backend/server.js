require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// FIX CORS - Only ONE CORS block allowed
app.use(cors({
  origin: "http://localhost:3005",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5005;

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/fullstack_admin_example';

mongoose.connect(MONGO)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

app.get('/', (req, res) => res.send('API running'));

app.listen(PORT, () => console.log('Server running on port', PORT));
