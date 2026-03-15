const mongoose = require('mongoose');
const Business = require('../models/Business');
const businesses = require('../data/businesses');
require('dotenv').config({ path: './backend/.env' });

const seedBusinesses = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';
        await mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' });
        console.log('✅ Connected to MongoDB for seeding businesses');

        // Clear existing businesses
        await Business.deleteMany({});
        console.log('🗑️  Cleared existing businesses');

        // Insert new businesses
        await Business.insertMany(businesses);
        console.log('🌱  Successfully seeded 15 famous businesses');

        mongoose.connection.close();
        process.exit();
    } catch (err) {
        console.error('❌ Error seeding businesses:', err);
        process.exit(1);
    }
};

seedBusinesses();
