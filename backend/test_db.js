const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

console.log('Testing connection to:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });
