const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Place = require('../models/Place');
const charDhamData = require('../data/char_dham.json');

async function fixCharDham() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB.");

        const dhamNames = ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath'];
        
        // Basic data to fall back if missing
        const fallbacks = {
            'Kedarnath': {
                name: 'Kedarnath',
                city: 'Rudraprayag',
                state: 'Uttarakhand',
                country: 'India',
                location: 'Kedarnath, Rudraprayag, Uttarakhand',
                coordinates: { latitude: 30.7346, longitude: 79.0669 },
                category: 'Temple',
                type: 'Spiritual',
                rating: 4.9,
                description: 'Kedarnath is a historic temple dedicated to Lord Shiva, located in the Garhwal Himalayas.',
                imageUrl: 'https://images.unsplash.com/photo-1626084042851-40994f31c26b?w=1200&q=90&fit=crop'
            },
            'Badrinath': {
                name: 'Badrinath',
                city: 'Chamoli',
                state: 'Uttarakhand',
                country: 'India',
                location: 'Badrinath, Chamoli, Uttarakhand',
                coordinates: { latitude: 30.7433, longitude: 79.4938 },
                category: 'Temple',
                type: 'Spiritual',
                rating: 4.8,
                description: 'Badrinath is a holy town and a significant pilgrimage site dedicated to Lord Vishnu.',
                imageUrl: 'https://images.unsplash.com/photo-1628045610815-5d9c22295bbb?w=1200&q=90&fit=crop'
            }
        };

        for (const name of dhamNames) {
            let place = await Place.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            
            if (place) {
                console.log(`Found ${name} in DB. Updating...`);
                // Force category and type to Temple / Spiritual
                if (!['Temple', 'Spiritual'].includes(place.category)) {
                    place.category = 'Temple';
                }
                place.type = 'Spiritual';

                // Fix tags
                if (place.tags && Array.isArray(place.tags)) {
                    place.tags = place.tags.filter(t => {
                        const lower = t.toLowerCase();
                        return !lower.includes('char dham') && !lower.includes('circuit') && !lower.includes('special');
                    });
                }
                
                await place.save();
                console.log(`Updated ${name} successfully.`);
            } else {
                console.log(`${name} NOT found in DB. Inserting...`);
                
                let dataToInsert = charDhamData.find(p => p.name.toLowerCase() === name.toLowerCase());
                
                if (!dataToInsert) {
                    dataToInsert = fallbacks[name];
                }

                if (dataToInsert) {
                    // Clean tags before inserting
                    if (dataToInsert.tags && Array.isArray(dataToInsert.tags)) {
                        dataToInsert.tags = dataToInsert.tags.filter(t => {
                            const lower = t.toLowerCase();
                            return !lower.includes('char dham') && !lower.includes('circuit') && !lower.includes('special');
                        });
                    }
                    dataToInsert.category = 'Temple';
                    dataToInsert.type = 'Spiritual';

                    // Remove id field if it exists (Mongo uses _id)
                    delete dataToInsert.id;

                    const newPlace = new Place(dataToInsert);
                    await newPlace.save();
                    console.log(`Inserted ${name} successfully.`);
                } else {
                    console.log(`No fallback data for ${name}. Could not insert.`);
                }
            }
        }

        console.log("Database update complete. Exiting.");
    } catch (err) {
        console.error("Error updating DB:", err);
    } finally {
        await mongoose.connection.close();
    }
}

fixCharDham();
