const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// For now, we will use a local URI or a placeholder. 
// In a real scenario, this comes from .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/favorites', require('./routes/favorites'));

app.get('/', (req, res) => {
    res.send('Swadeshi Yatra Backend Configured');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
