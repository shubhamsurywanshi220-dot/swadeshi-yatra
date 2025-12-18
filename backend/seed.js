const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');

dotenv.config();

const places = require('./data/allPlaces');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await Place.deleteMany({});
        console.log('Cleared existing places.');

        // Insert new data
        await Place.insertMany(places);
        console.log('Seeded database with initial places.');

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Seeding Error:', err);
        process.exit(1);
    });
