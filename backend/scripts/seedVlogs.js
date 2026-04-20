/**
 * seedVlogs.js — Seeds the database with 4 high-quality travel vlog entries.
 * Uses publicly accessible, royalty-free HD video URLs from Pexels.
 *
 * Usage:
 *   node backend/scripts/seedVlogs.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Vlog = require('../models/Vlog');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

const SEED_VLOGS = [
    {
        title: 'Goa Beach Sunset — Golden Hour Magic 🌅',
        // Pexels royalty-free beach/sunset video
        video_url: 'https://videos.pexels.com/video-files/1448735/1448735-uhd_2560_1440_24fps.mp4',
        thumbnail: 'https://images.pexels.com/photos/1650693/pexels-photo-1650693.jpeg?auto=compress&cs=tinysrgb&w=1200',
        location: 'Goa',
        destination_id: null,
        user: 'Admin',
        description: 'A breathtaking view of Goa beach at sunset. The golden hour transforms the coastline into a magical landscape.',
        category: 'Nature',
        likes: 4820,
        views: 98700,
        duration: '0:32',
        status: 'approved',
    },
    {
        title: 'Hampi Ruins — A Journey Through Time 🏛️',
        // Pexels royalty-free ancient ruins / landscape
        video_url: 'https://videos.pexels.com/video-files/3214448/3214448-uhd_2560_1440_25fps.mp4',
        thumbnail: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1200',
        location: 'Hampi, Karnataka',
        destination_id: null,
        user: 'Admin',
        description: 'Exploring the UNESCO World Heritage Site of Hampi. Ancient boulders, temples and ruins tell a story of the Vijayanagara Empire.',
        category: 'Heritage',
        likes: 7130,
        views: 215000,
        duration: '0:45',
        status: 'approved',
    },
    {
        title: 'Mountain Trekking in the Himalayas ❄️',
        // Pexels royalty-free mountain/snow video
        video_url: 'https://videos.pexels.com/video-files/857199/857199-hd_1920_1080_25fps.mp4',
        thumbnail: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1200',
        location: 'Manali, Himachal Pradesh',
        destination_id: null,
        user: 'Admin',
        description: 'An exhilarating trek through snow-covered Himalayan passes. The air is thin but the views are beyond words.',
        category: 'Adventure',
        likes: 9340,
        views: 312000,
        duration: '0:58',
        status: 'approved',
    },
    {
        title: 'Kerala Backwaters — A Houseboat Dream 🌿',
        // Pexels royalty-free tropical water/river video
        video_url: 'https://videos.pexels.com/video-files/1389394/1389394-hd_1920_1080_30fps.mp4',
        thumbnail: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1200',
        location: 'Alleppey, Kerala',
        destination_id: null,
        user: 'Admin',
        description: 'Gliding through the tranquil backwaters of Kerala on a traditional houseboat. Coconut trees line the banks as time slows down.',
        category: 'Nature',
        likes: 6210,
        views: 178000,
        duration: '0:38',
        status: 'approved',
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' });
        console.log('✅ Connected to MongoDB');

        // Remove any previously seeded admin vlogs to avoid duplicates
        await Vlog.deleteMany({ user: 'Admin' });
        console.log('🗑️  Cleared old Admin-seeded vlogs');

        const inserted = await Vlog.insertMany(SEED_VLOGS);
        console.log(`✅ Successfully seeded ${inserted.length} travel vlogs:`);
        inserted.forEach(v => console.log(`   - ${v.title} [${v.status}]`));

    } catch (err) {
        console.error('❌ Seed error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

seed();
