/**
 * Fix and update Travel Package images with high-quality ones
 * Run: node scripts/fix_package_images.js
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const TravelPackage = require('../models/TravelPackage');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

const UPDATES = [
    {
        key: 'Char Dham',
        imageUrl: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200',
        galleryImages: [
            'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800',
            'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'
        ]
    },
    {
        key: 'Manali',
        imageUrl: 'https://images.unsplash.com/photo-1615651261314-b6a83664d50c?w=1200',
        galleryImages: [
            'https://images.unsplash.com/photo-1605649433653-4888801d8a43?w=800',
            'https://images.unsplash.com/photo-1594142404563-64cccaf5a10f?w=800'
        ]
    },
    {
        key: 'Ladakh',
        imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200',
        galleryImages: [
            'https://images.unsplash.com/photo-1599351410111-9a7008f1b9f4?w=800',
            'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=800'
        ]
    },
    {
        key: 'Goa',
        imageUrl: 'https://images.unsplash.com/photo-1512757776214-26d36777b513?w=1200',
        galleryImages: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800'
        ]
    },
    {
        key: 'Coorg',
        imageUrl: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=1200',
        galleryImages: [
            'https://images.unsplash.com/photo-1582236940902-869f379f8241?w=800'
        ]
    }
];

async function fixImages() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' });
        console.log('✅ Connected to MongoDB');

        const allPackages = await TravelPackage.find({}, 'title');
        console.log(`📦 Found ${allPackages.length} packages in database.`);

        for (const update of UPDATES) {
            const match = allPackages.find(p => p.title.toLowerCase().includes(update.key.toLowerCase()));
            
            if (match) {
                await TravelPackage.updateOne(
                    { _id: match._id },
                    { 
                        $set: { 
                            imageUrl: update.imageUrl,
                            galleryImages: update.galleryImages
                        } 
                    }
                );
                console.log(`✅ Updated images for: "${match.title}" (Matched via "${update.key}")`);
            } else {
                console.log(`⚠️ No package found matching: "${update.key}"`);
            }
        }

        console.log('\n✨ Image update complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating images:', err.message);
        process.exit(1);
    }
}

fixImages();
