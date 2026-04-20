const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

const PlaceSchema = new mongoose.Schema({}, { strict: false });
const Place = mongoose.model('Place', PlaceSchema);

const BusinessSchema = new mongoose.Schema({}, { strict: false });
const Business = mongoose.model('Business', BusinessSchema);

async function checkData() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' });
        console.log('Connected to MongoDB');

        const totalPlaces = await Place.countDocuments();
        const publishedPlaces = await Place.countDocuments({ isPublished: { $ne: false } });
        
        const totalBus = await Business.countDocuments();
        const verifiedBus = await Business.countDocuments({ isVerified: true });

        console.log(`Total Places: ${totalPlaces}`);
        console.log(`Published Places: ${publishedPlaces}`);
        console.log(`Total Businesses: ${totalBus}`);
        console.log(`Verified Businesses: ${verifiedBus}`);

        const uniqueCategories = await Place.distinct('category');
        console.log('Unique Place Categories:', uniqueCategories);

        const uniqueBusCategories = await Business.distinct('category');
        console.log('Unique Business Categories:', uniqueBusCategories);

        const unverifiedBus = await Business.countDocuments({ isVerified: false });
        console.log(`Unverified Businesses: ${unverifiedBus}`);

        const uniqueCities = await Place.distinct('city');
        console.log('Unique Cities:', uniqueCities.slice(0, 20), '... total:', uniqueCities.length);

        const withSpaces = await Place.find({
            $or: [
                { state: /^ / }, { state: / $/ },
                { city: /^ / }, { city: / $/ },
                { category: /^ / }, { category: / $/ }
            ]
        });
        console.log(`Places with leading/trailing spaces: ${withSpaces.length}`);

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
