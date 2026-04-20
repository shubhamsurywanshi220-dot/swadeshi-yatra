const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Place = require('../models/Place');
const Activity = require('../models/Activity');
const allPlaces = require('../data/allPlaces');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

async function syncDestinations() {
    try {
        console.log('🚀 Starting Master Destination Synchronization...');
        console.log(`📡 Target: ${MONGO_URI}`);
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB.');

        console.log(`📦 Registry size: ${allPlaces.length} destinations.`);

        let addedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;

        for (const placeData of allPlaces) {
            try {
                // Determine 'type' from category if not present
                const type = placeData.type || (['Heritage', 'Fort', 'Temple', 'Museum'].includes(placeData.category) ? 'Historical' : 'Nature');

                const updateData = {
                    name: placeData.name,
                    description: placeData.description,
                    location: placeData.location,
                    city: placeData.city,
                    state: placeData.state,
                    category: placeData.category,
                    type: type,
                    imageUrl: placeData.imageUrl,
                    rating: placeData.rating || 4.5,
                    bestTime: placeData.bestTime,
                    entryFee: String(placeData.entryFee),
                    coordinates: placeData.coordinates,
                    isPublished: true, // Always publish for sync
                    isFeatured: placeData.isFeatured || false,
                    isHiddenGem: placeData.isHiddenGem || false,
                    crowdLevel: placeData.crowdLevel || 'Medium',
                    galleryImages: placeData.galleryImages || [],
                    weatherInfo: placeData.weatherInfo || 'Mostly Clear',
                    culturalVault: placeData.culturalVault || { stories: '', myths: '', history: '' },
                    exploreSurroundings: placeData.exploreSurroundings || { stay: [], food: [], transport: [], atm: [] },
                    detailedInfo: placeData.detailedInfo || { introduction: placeData.description, history: '', significance: '' },
                    isEcoFriendly: placeData.isEcoFriendly || false,
                    contactInfo: placeData.contactInfo || {}
                };

                // Use name and city as unique identifier for upsert
                const result = await Place.findOneAndUpdate(
                    { name: placeData.name, city: placeData.city },
                    { $set: updateData },
                    { upsert: true, new: true, runValidators: true }
                );

                if (result.createdAt && result.updatedAt && result.createdAt.getTime() === result.updatedAt.getTime()) {
                    addedCount++;
                    // Log activity for new additions
                    await Activity.create({
                        type: 'CREATE_PLACE',
                        message: `System Sync: Added new destination ${placeData.name}`,
                        metadata: { placeId: result._id, source: 'sync_script' }
                    });
                } else {
                    updatedCount++;
                }

                if ((addedCount + updatedCount) % 50 === 0) {
                    console.log(`🕒 Progress: ${addedCount + updatedCount}/${allPlaces.length}...`);
                }
            } catch (err) {
                console.error(`❌ Error syncing ${placeData.name}:`, err.message);
                errorCount++;
            }
        }

        console.log('\n✨ Synchronization Complete!');
        console.log(`✅ Newly Added: ${addedCount}`);
        console.log(`🔄 Updated/Verified: ${updatedCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📊 Final DB Count Target: ${allPlaces.length}`);

        // Logging mismatch if any
        const finalCount = await Place.countDocuments();
        if (finalCount !== allPlaces.length) {
            console.warn(`⚠️ Warning: Mismatch detected. Registry has ${allPlaces.length}, but DB has ${finalCount}.`);
        } else {
            console.log('🏅 Integrity Check: DB and Registry are perfectly aligned (412/412).');
        }

    } catch (error) {
        console.error('💥 Critical Sync Failure:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed.');
        process.exit();
    }
}

syncDestinations();
