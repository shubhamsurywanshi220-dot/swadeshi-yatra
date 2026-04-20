const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Place = require('../models/Place');
const Activity = require('../models/Activity');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

async function migrateNatureGems() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected successfully.');

        const dataPath = path.join(__dirname, '../data/hidden_nature_gems.json');
        const natureGems = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        console.log(`Found ${natureGems.length} nature gems in JSON.`);

        let addedCount = 0;
        let skippedCount = 0;

        for (const gem of natureGems) {
            // Check for duplicate by name and city
            const existing = await Place.findOne({ 
                name: gem.name,
                city: gem.city
            });

            if (existing) {
                console.log(`Skipping existing destination: ${gem.name}`);
                skippedCount++;
                continue;
            }

            // Map JSON fields to Schema fields
            const newPlace = new Place({
                name: gem.name,
                description: gem.description,
                location: `${gem.city}, ${gem.state}`,
                city: gem.city,
                state: gem.state,
                country: gem.country || 'India',
                category: gem.category,
                type: 'Nature',
                imageUrl: gem.images && gem.images.length > 0 ? gem.images[0] : '/images/default_nature.jpg',
                galleryImages: gem.images || [],
                rating: 4.5 + Math.random() * 0.5, // Random high rating for gems
                bestTime: gem.best_time_to_visit,
                entryFee: typeof gem.entry_fee === 'object' ? `Indian: ${gem.entry_fee.indian}` : gem.entry_fee,
                coordinates: {
                    latitude: gem.latitude,
                    longitude: gem.longitude
                },
                crowdLevel: gem.crowd_level || 'Low',
                isHiddenGem: gem.is_hidden_gem || true,
                isPublished: true,
                isFeatured: gem.is_hidden_gem || false,
                detailedInfo: {
                    introduction: gem.description,
                    history: gem.detailedInfo ? gem.detailedInfo.history : '',
                    culturalSignificance: gem.detailedInfo ? gem.detailedInfo.cultural_significance : '',
                    naturalFeatures: gem.detailedInfo ? gem.detailedInfo.natural_features : '',
                    interestingFacts: gem.detailedInfo ? gem.detailedInfo.interesting_facts : '',
                    visitingInfo: `Best time: ${gem.best_time_to_visit}. Crowd level: ${gem.crowd_level}.`,
                    additionalImages: gem.images || []
                }
            });

            await newPlace.save();
            
            // Log activity
            await Activity.create({
                type: 'CREATE_PLACE',
                message: `Added new hidden gem: ${gem.name}`,
                metadata: {
                    placeId: newPlace._id,
                    category: gem.category,
                    state: gem.state
                }
            });

            console.log(`Added: ${gem.name}`);
            addedCount++;
        }

        console.log('\nMigration Summary:');
        console.log(`Total processed: ${natureGems.length}`);
        console.log(`Newly added: ${addedCount}`);
        console.log(`Skipped (duplicates): ${skippedCount}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit();
    }
}

migrateNatureGems();
