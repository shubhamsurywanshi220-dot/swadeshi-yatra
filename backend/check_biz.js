const mongoose = require('mongoose');
const Business = require('./models/Business');
require('dotenv').config({ path: './backend/.env' });

const checkDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';
        await mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' });
        const count = await Business.countDocuments();
        const verifiedCount = await Business.countDocuments({ isVerified: true });
        console.log(`Total Businesses: ${count}`);
        console.log(`Verified Businesses: ${verifiedCount}`);
        
        if (count > 0) {
            const sample = await Business.findOne();
            console.log('Sample Business:', JSON.stringify(sample, null, 2));
        }
        
        mongoose.connection.close();
    } catch (err) {
        console.error('Error checking DB:', err);
    }
};

checkDB();
