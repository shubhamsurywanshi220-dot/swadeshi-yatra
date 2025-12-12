const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');

dotenv.config();

const places = [
    {
        name: 'Taj Mahal',
        location: 'Agra, UP',
        type: 'Historical',
        rating: 4.8,
        description: 'Symbol of love and one of the Seven Wonders of the World.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/1200px-Taj-Mahal.jpg'
    },
    {
        name: 'Jaipur City Palace',
        location: 'Jaipur, Rajasthan',
        type: 'Heritage',
        rating: 4.7,
        description: 'A magnificent palace complex that includes the Chandra Mahal and Mubarak Mahal.',
        imageUrl: 'https://www.tourism-of-india.com/pictures/travel_guide/attractions/city-palace-jaipur-240.jpeg'
    },
    {
        name: 'Kerala Backwaters',
        location: 'Alleppey, Kerala',
        type: 'Nature',
        rating: 4.9,
        description: 'A network of brackish lagoons and lakes lying parallel to the Arabian Sea coast.',
        imageUrl: 'https://www.keralatourism.org/images/destination/large/alleppey_backwaters20131031102432_202_1.jpg'
    }
];

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
