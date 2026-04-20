const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

// Simplified Place Schema
const PlaceSchema = new mongoose.Schema({
    name: String,
    imageUrl: String
}, { strict: false });

const Place = mongoose.model('Place', PlaceSchema);

const updates = [
    {
        name: 'Sullia',
        url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Sullia%2CDakshina_Karnataka.jpg'
    },
    {
        name: 'Nisargadhama',
        url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Nisargadhama.jpg'
    },
    {
        name: 'Talacauvery (Origin of River Cauvery)',
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Talacauvery_Temple.jpg'
    },
    {
        name: 'Heggodu',
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Ninasam_Heggodu.jpg'
    },
    {
        name: 'Kundadri Hills',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Sunrise_at_Kundadri_Hill.jpg'
    },
    {
        name: 'Byndoor Backwaters',
        url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Saurpanika_river_Arabian_Sea_Byndoor.jpg'
    }
];

async function updateImages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        let updatedCount = 0;
        let matchedCount = 0;

        for (const update of updates) {
            // Use regex for flexible matching if needed, but start with exact or partial
            const result = await Place.updateOne(
                { name: { $regex: new RegExp(update.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
                { $set: { imageUrl: update.url } }
            );

            if (result.matchedCount > 0) {
                matchedCount += result.matchedCount;
                if (result.modifiedCount > 0) {
                    updatedCount += result.modifiedCount;
                    console.log(`✅ Updated: ${update.name}`);
                } else {
                    console.log(`ℹ️ Already up to date: ${update.name}`);
                }
            } else {
                console.log(`❌ Not found: ${update.name}`);
            }
        }

        console.log(`\nSummary: Matched ${matchedCount} places, Updated ${updatedCount} places.`);
        
        await mongoose.connection.close();
        console.log('Disconnected.');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateImages();
