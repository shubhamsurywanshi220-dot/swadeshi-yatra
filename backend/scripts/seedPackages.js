/**
 * Seed script for initial Travel Packages
 * Run: node scripts/seedPackages.js
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const TravelPackage = require('../models/TravelPackage');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

const packages = [
    {
        title: 'Char Dham Yatra',
        description: 'Embark on the sacred Char Dham pilgrimage covering Yamunotri, Gangotri, Kedarnath, and Badrinath. This spiritual journey through the majestic Himalayas offers divine blessings and breathtaking mountain scenery.',
        shortDescription: 'Sacred pilgrimage to four holy shrines in Uttarakhand',
        duration: { nights: 4, days: 5 },
        price: { original: 15999, discounted: 12999, currency: '₹', perPerson: true },
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
        locations: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath'],
        tag: 'Best Seller',
        category: 'Pilgrimage',
        itinerary: [
            { day: 1, title: 'Delhi to Yamunotri', description: 'Depart from Delhi, drive through scenic Uttarakhand valleys. Arrive and visit Yamunotri Temple.', activities: ['Temple Visit', 'Hot Springs'], meals: 'Dinner', stay: 'Hotel in Barkot' },
            { day: 2, title: 'Gangotri Darshan', description: 'Drive to Gangotri. Visit the sacred Gangotri Temple on the banks of the Bhagirathi river.', activities: ['Gangotri Temple', 'River Aarti'], meals: 'Breakfast, Lunch, Dinner', stay: 'Hotel in Uttarkashi' },
            { day: 3, title: 'Kedarnath Trek', description: 'Drive to Gaurikund. Trek to Kedarnath Temple (16 km) or take a helicopter.', activities: ['Kedarnath Temple', 'Mountain Trek'], meals: 'Breakfast, Lunch, Dinner', stay: 'Guest House in Kedarnath' },
            { day: 4, title: 'Badrinath Darshan', description: 'Drive to Badrinath. Visit Badrinath Temple and explore Mana Village, the last Indian village.', activities: ['Badrinath Temple', 'Mana Village', 'Tapt Kund'], meals: 'Breakfast, Lunch, Dinner', stay: 'Hotel in Badrinath' },
            { day: 5, title: 'Return to Delhi', description: 'Early morning aarti. Drive back to Delhi with beautiful memories.', activities: ['Morning Aarti', 'Return Journey'], meals: 'Breakfast', stay: '' }
        ],
        inclusions: ['Hotel Stay (3-star)', 'All Meals', 'AC Transport', 'Guide', 'Temple Entry'],
        exclusions: ['Flights', 'Helicopter Ride', 'Personal Expenses', 'Pony/Palki Ride'],
        highlights: ['Visit all four sacred Dhams', 'Himalayan Mountain Views', 'Holy River Darshan', 'Mana Village Visit'],
        startingFrom: 'Delhi',
        difficulty: 'Moderate',
        bestSeason: 'May - October',
        maxGroupSize: 15,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 234,
        sortOrder: 1
    },
    {
        title: 'Manali Adventure Trip',
        description: 'Experience the magic of Manali with snow-capped mountains, lush green valleys, and thrilling adventure activities. From Solang Valley paragliding to Old Manali cafe hopping, this trip has it all.',
        shortDescription: 'Mountains, adventure & valley vibes in Himachal',
        duration: { nights: 2, days: 3 },
        price: { original: 8999, discounted: 6999, currency: '₹', perPerson: true },
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
        locations: ['Manali', 'Solang Valley', 'Old Manali', 'Hadimba Temple'],
        tag: 'Trending',
        category: 'Adventure',
        itinerary: [
            { day: 1, title: 'Arrive in Manali', description: 'Arrive in Manali. Visit Hadimba Temple & Mall Road. Evening at leisure.', activities: ['Hadimba Temple', 'Mall Road', 'Café Hopping'], meals: 'Dinner', stay: 'Hotel in Manali' },
            { day: 2, title: 'Solang Valley Adventure', description: 'Full day at Solang Valley. Try paragliding, zorbing, and skiing (seasonal).', activities: ['Paragliding', 'Zorbing', 'Snow Activities'], meals: 'Breakfast, Lunch, Dinner', stay: 'Hotel in Manali' },
            { day: 3, title: 'Old Manali & Departure', description: 'Explore Old Manali, visit Vashisht Hot Springs. Depart with memories.', activities: ['Old Manali', 'Vashisht Temple', 'Hot Springs'], meals: 'Breakfast', stay: '' }
        ],
        inclusions: ['Hotel Stay', 'Breakfast & Dinner', 'Sightseeing', 'Transport from Chandigarh'],
        exclusions: ['Adventure Activity Charges', 'Personal Expenses', 'Flights'],
        highlights: ['Paragliding in Solang Valley', 'Hadimba Temple', 'Hot Springs Bath', 'Mountain Views'],
        startingFrom: 'Chandigarh',
        difficulty: 'Easy',
        bestSeason: 'March - June, Oct - Dec',
        maxGroupSize: 20,
        isFeatured: true,
        rating: 4.6,
        reviewCount: 189,
        sortOrder: 2
    },
    {
        title: 'Leh Ladakh Expedition',
        description: 'Journey through the roof of the world. Experience magnetic hills, pristine Pangong Lake, ancient monasteries, and the most scenic roads on Earth. A trip that transforms your perspective.',
        shortDescription: 'Ultimate road trip through the land of high passes',
        duration: { nights: 5, days: 6 },
        price: { original: 22999, discounted: 18999, currency: '₹', perPerson: true },
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
        locations: ['Leh', 'Pangong Lake', 'Nubra Valley', 'Khardung La', 'Magnetic Hill'],
        tag: 'Premium',
        category: 'Adventure',
        itinerary: [
            { day: 1, title: 'Arrival in Leh', description: 'Fly to Leh. Rest and acclimatize at 11,500 ft. Evening walk to Leh Market.', activities: ['Acclimatization', 'Leh Market'], meals: 'Dinner', stay: 'Hotel in Leh' },
            { day: 2, title: 'Leh Sightseeing', description: 'Visit Shanti Stupa, Leh Palace, Magnetic Hill, and Confluence of Indus & Zanskar.', activities: ['Shanti Stupa', 'Leh Palace', 'Magnetic Hill', 'Sangam Point'], meals: 'Breakfast, Lunch, Dinner', stay: 'Hotel in Leh' },
            { day: 3, title: 'Nubra Valley', description: 'Cross Khardung La (18,380 ft). Drive to Nubra Valley. Camel ride on sand dunes.', activities: ['Khardung La Pass', 'Diskit Monastery', 'Double Hump Camel Ride'], meals: 'Breakfast, Lunch, Dinner', stay: 'Camp in Nubra' },
            { day: 4, title: 'Pangong Lake', description: 'Drive to the stunning Pangong Tso lake. Watch the colors change through the day.', activities: ['Pangong Lake', 'Photography', 'Stargazing'], meals: 'Breakfast, Lunch, Dinner', stay: 'Camp at Pangong' },
            { day: 5, title: 'Pangong to Leh', description: 'Drive back to Leh via Chang La pass. Visit Hemis Monastery.', activities: ['Chang La Pass', 'Hemis Monastery', 'Thiksey Monastery'], meals: 'Breakfast, Lunch, Dinner', stay: 'Hotel in Leh' },
            { day: 6, title: 'Departure', description: 'Morning visit to local market. Fly back home.', activities: ['Shopping', 'Departure'], meals: 'Breakfast', stay: '' }
        ],
        inclusions: ['Hotel & Camp Stay', 'All Meals', 'Innova/Tempo Traveller', 'Inner Line Permits', 'Oxygen Cylinder'],
        exclusions: ['Flights to/from Leh', 'AMS Medicine', 'Personal Expenses'],
        highlights: ['Pangong Lake Camping', 'Khardung La - World\'s Highest Motorable Pass', 'Nubra Valley Camel Ride', 'Ancient Monasteries'],
        startingFrom: 'Leh',
        difficulty: 'Challenging',
        bestSeason: 'June - September',
        maxGroupSize: 12,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 312,
        sortOrder: 3
    },
    {
        title: 'Goa Beach Package',
        description: 'Sun, sand, and sea! Explore the vibrant beaches of Goa, indulge in water sports, savor Goan cuisine, and experience the famous nightlife. Perfect for friends and couples.',
        shortDescription: 'Sun, sand, parties & water sports in Goa',
        duration: { nights: 3, days: 4 },
        price: { original: 9999, discounted: 7499, currency: '₹', perPerson: true },
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
        locations: ['North Goa', 'South Goa', 'Old Goa', 'Dudhsagar'],
        tag: 'Trending',
        category: 'Beach',
        itinerary: [
            { day: 1, title: 'Arrive in Goa', description: 'Check in at beach resort. Visit Calangute & Baga Beach. Evening at Tito\'s Lane.', activities: ['Beach Visit', 'Nightlife', 'Sunset View'], meals: 'Dinner', stay: 'Beach Resort' },
            { day: 2, title: 'North Goa Tour', description: 'Fort Aguada, Anjuna Flea Market, Vagator Beach. Water sports at Calangute.', activities: ['Fort Aguada', 'Water Sports', 'Flea Market'], meals: 'Breakfast, Lunch, Dinner', stay: 'Beach Resort' },
            { day: 3, title: 'South Goa & Heritage', description: 'Visit Basilica of Bom Jesus, Palolem Beach, spice plantation tour.', activities: ['Heritage Churches', 'Palolem Beach', 'Spice Plantation'], meals: 'Breakfast, Lunch, Dinner', stay: 'Beach Resort' },
            { day: 4, title: 'Departure', description: 'Morning beach walk. Shopping for souvenirs. Departure.', activities: ['Beach Walk', 'Shopping', 'Departure'], meals: 'Breakfast', stay: '' }
        ],
        inclusions: ['Beach Resort Stay', 'Breakfast & Dinner', 'Sightseeing', 'Airport Transfer'],
        exclusions: ['Flights', 'Water Sports Charges', 'Personal Expenses', 'Lunch'],
        highlights: ['Water Sports at Calangute', 'Fort Aguada Visit', 'Goan Seafood', 'Beach Sunset'],
        startingFrom: 'Goa',
        difficulty: 'Easy',
        bestSeason: 'October - March',
        maxGroupSize: 25,
        isFeatured: false,
        rating: 4.5,
        reviewCount: 156,
        sortOrder: 4
    },
    {
        title: 'Coorg Nature Retreat',
        description: 'Escape to the Scotland of India! Trek through misty coffee plantations, visit stunning waterfalls, explore Tibetan monasteries, and rejuvenate in nature\'s paradise.',
        shortDescription: 'Coffee plantations & misty mountains in Karnataka',
        duration: { nights: 2, days: 3 },
        price: { original: 7999, discounted: 5999, currency: '₹', perPerson: true },
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        locations: ['Coorg', 'Abbey Falls', 'Dubare Elephant Camp', 'Raja\'s Seat'],
        tag: 'New',
        category: 'Nature',
        itinerary: [
            { day: 1, title: 'Arrive in Coorg', description: 'Drive from Bangalore. Check in at a coffee estate stay. Visit Raja\'s Seat for sunset.', activities: ['Raja\'s Seat', 'Coffee Estate Tour', 'Sunset Point'], meals: 'Dinner', stay: 'Coffee Estate Homestay' },
            { day: 2, title: 'Waterfalls & Elephants', description: 'Visit Abbey Falls, Dubare Elephant Camp for elephant bathing. Namdroling Monastery.', activities: ['Abbey Falls', 'Elephant Camp', 'Golden Temple'], meals: 'Breakfast, Lunch, Dinner', stay: 'Coffee Estate Homestay' },
            { day: 3, title: 'Trek & Departure', description: 'Morning trek through coffee plantations. Visit Talacauvery. Drive back.', activities: ['Coffee Plantation Trek', 'Talacauvery', 'Return'], meals: 'Breakfast', stay: '' }
        ],
        inclusions: ['Homestay', 'All Meals', 'Sightseeing Transport', 'Elephant Camp Entry'],
        exclusions: ['Travel to/from Coorg', 'Personal Expenses', 'Tips'],
        highlights: ['Coffee Plantation Stay', 'Elephant Bathing', 'Abbey Falls', 'Misty Mountain Views'],
        startingFrom: 'Bangalore',
        difficulty: 'Easy',
        bestSeason: 'Year Round (Best: Oct-Mar)',
        maxGroupSize: 15,
        isFeatured: false,
        rating: 4.7,
        reviewCount: 98,
        sortOrder: 5
    }
];

async function seedPackages() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' });
        console.log('✅ Connected to MongoDB');

        const existingCount = await TravelPackage.countDocuments();
        if (existingCount > 0) {
            console.log(`📦 ${existingCount} packages already exist. Skipping seed.`);
            console.log('   To re-seed, run: db.travelpackages.drop() in MongoDB first.');
            process.exit(0);
        }

        const result = await TravelPackage.insertMany(packages);
        console.log(`✅ Successfully seeded ${result.length} travel packages!`);
        result.forEach(p => console.log(`   📦 ${p.title} — ${p.duration.nights}N/${p.duration.days}D — ${p.price.currency}${p.price.discounted}`));
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding packages:', err.message);
        process.exit(1);
    }
}

seedPackages();
