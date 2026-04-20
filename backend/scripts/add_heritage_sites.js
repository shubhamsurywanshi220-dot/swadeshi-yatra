const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Place = require('../models/Place');
const Activity = require('../models/Activity');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

const destinations = [
    {
        name: "Konark Sun Temple",
        city: "Konark",
        state: "Odisha",
        country: "India",
        location: "Konark, Odisha",
        coordinates: { latitude: 19.8876, longitude: 86.0945 },
        category: "Heritage",
        type: "Historical",
        rating: 4.9,
        description: "A UNESCO World Heritage site known for its chariot-shaped temple dedicated to the Sun God.",
        detailedInfo: {
            introduction: "The Sun Temple at Konark is a 13th-century architectural masterpiece dedicated to the solar deity Surya. Located on the coastline of Odisha, it is renowned for its monumental scale and intricate stone carvings.",
            history: "Built in the 13th century by King Narasimhadeva I of the Eastern Ganga dynasty around 1250 CE. It was designed to celebrate military triumphs and honor the Sun God.",
            significance: "It represents the pinnacle of Kalinga architecture and devotion to Surya. It was once used as a navigational landmark by sailors, who called it the 'Black Pagoda'.",
            architecture: "The temple is designed as a giant chariot with 24 intricately carved wheels drawn by seven horses. Each wheel acts as a precise sundial.",
            visitingInfo: "Open from 6:00 AM to 8:00 PM. Best visited between October and March.",
            keyFacts: [
                "UNESCO World Heritage Site since 1984",
                "The 24 wheels represent the 24 hours of a day",
                "Built from Khondalite rocks",
                "Famous for its erotic sculptures and celestial dancers"
            ]
        },
        culturalVault: {
            history: "The temple was built to commemorate the victory of King Narasimhadeva I over the Muslims. It took 12 years and 12,000 artisans to complete.",
            stories: "Legend says that the temple's peak contained a massive magnet that caused ships to wreck along the shore, leading to its partial dismantling by early sailors.",
            myths: "Local folklore tells of the architect's son, Dharmapada, who completed the temple's crown when the 1,200 masons failed, before jumping into the sea to save his father's reputation."
        },
        imageUrl: "assets/destinations/konark_1.jpg",
        galleryImages: [
            "assets/destinations/konark_1.jpg",
            "assets/destinations/konark_2.jpg"
        ],
        entryFee: "₹40 (Indian), ₹600 (Foreign)",
        bestTime: "October to March",
        isPublished: true,
        isFeatured: true
    },
    {
        name: "Somnath Temple",
        city: "Veraval",
        state: "Gujarat",
        country: "India",
        location: "Veraval, Gujarat",
        coordinates: { latitude: 20.8880, longitude: 70.4012 },
        category: "Heritage",
        type: "Spiritual",
        rating: 4.8,
        description: "The first of the twelve holy Jyotirlinga shrines of Lord Shiva, known as the 'Shrine Eternal'.",
        detailedInfo: {
            introduction: "Somnath Temple is a majestic shrine situated on the western coast of Gujarat. It is revered as the first Jyotirlinga of Lord Shiva and stands as a symbol of resilience.",
            history: "The temple has been destroyed and reconstructed 17 times over centuries. The current structure was rebuilt in 1951 under the guidance of Sardar Vallabhbhai Patel.",
            significance: "It is one of the most sacred pilgrimage sites for Hindus. The name Somnath means 'Lord of the Moon'.",
            architecture: "Built in the Chalukya style (Kailash Mahameru Prasad), it features a towering shikhara, intricate carvings, and a stunning view of the Arabian Sea.",
            visitingInfo: "Open for Darshan from 6:00 AM to 9:30 PM. Light and Sound show at 8:00 PM.",
            keyFacts: [
                "First of the 12 Jyotirlingas",
                "The 'Baan Stambh' indicates a straight line to Antarctica with no land in between",
                "The temple gold was once looted by various invaders including Mahmud of Ghazni"
            ]
        },
        culturalVault: {
            history: "The temple's history is a saga of destruction and resurrection, reflecting the indomitable spirit of Indian heritage.",
            stories: "The moon god, Chandra, is said to have built the original golden temple after being cured of a curse by Lord Shiva at this spot.",
            myths: "It is believed that the site has been sacred since the Satya Yuga, with the temple being built in gold by Somraj, silver by Ravana, and wood by Krishna."
        },
        imageUrl: "assets/destinations/somnath_1.jpg",
        galleryImages: ["assets/destinations/somnath_1.jpg"],
        entryFee: "Free",
        bestTime: "October to March",
        isPublished: true,
        isFeatured: true
    },
    {
        name: "Kedarnath Temple",
        city: "Kedarnath",
        state: "Uttarakhand",
        country: "India",
        location: "Kedarnath, Uttarakhand",
        coordinates: { latitude: 30.7352, longitude: 79.0669 },
        category: "Heritage",
        type: "Spiritual",
        rating: 5.0,
        description: "A sacred Hindu temple dedicated to Lord Shiva, located in the Garhwal Himalayan range.",
        detailedInfo: {
            introduction: "Kedarnath is one of the holiest pilgrim centers in northern India, located at an altitude of 3,583 meters near the Mandakini river.",
            history: "Believed to be originally built by the Pandavas and later revived by Adi Shankaracharya in the 8th century.",
            significance: "It is one of the 12 Jyotirlingas and the most important of the Panch Kedar temples.",
            architecture: "Constructed with massive grey stone slabs, it is built to survive the harsh Himalayan climate and geological shifts.",
            visitingInfo: "Accessible only from April (Akshaya Tritiya) to November (Kartik Purnima). Requires a 16km trek from Gaurikund.",
            keyFacts: [
                "Survived the devastating 2013 floods with minimal damage due to a massive boulder",
                "Remained covered in snow for 400 years during the Little Ice Age",
                "The temple is nearly 1000 years old"
            ]
        },
        culturalVault: {
            history: "The Pandavas sought Lord Shiva's penance here after the Kurukshetra war. Shiva turned into a bull to hide from them.",
            stories: "The 'Bhairon Baba' temple nearby is believed to protect the Kedarnath temple during the winter months when it is closed.",
            myths: "It is said that the hump of the bull (Shiva) appeared at Kedarnath, the arms at Tungnath, the face at Rudranath, and so on."
        },
        imageUrl: "assets/destinations/kedarnath_1.jpg",
        galleryImages: ["assets/destinations/kedarnath_1.jpg"],
        entryFee: "Free",
        bestTime: "May to June, September to October",
        isPublished: true,
        isFeatured: true
    },
    {
        name: "Badrinath Temple",
        city: "Badrinath",
        state: "Uttarakhand",
        country: "India",
        location: "Badrinath, Uttarakhand",
        coordinates: { latitude: 30.7433, longitude: 79.4938 },
        category: "Heritage",
        type: "Spiritual",
        rating: 4.9,
        description: "A holy temple dedicated to Lord Vishnu, part of the main Char Dham pilgrimage.",
        detailedInfo: {
            introduction: "Badrinath Temple, also known as Badrinarayan Temple, is situated along the Alaknanda River in the hill town of Badrinath.",
            history: "Revived by Adi Shankaracharya in the 8th century; the temple has undergone several renovations due to avalanches.",
            significance: "Dedicated to the dual form of Vishnu (Nara-Narayana). It is the only Char Dham site in the Himalayas.",
            architecture: "Has a colorful facade with a small cupola on top, covered with a gold-plated roof. The stones are carved with traditional motifs.",
            visitingInfo: "Open from April to November. The Tapt Kund hot springs nearby are used for ritual bathing.",
            keyFacts: [
                "The idol of Lord Vishnu is made of Saligram stone",
                "The priests (Rawals) are Nambudiri Brahmins from Kerala",
                "The temple is surrounded by the Nar and Narayana mountain ranges"
            ]
        },
        culturalVault: {
            history: "Lord Vishnu performed long penance here. Goddess Lakshmi turned into a 'Badri' (Berry) tree to shield him from the sun.",
            stories: "The 'Mata Murti Ka Mela' is a significant festival celebrating the descent of the river Ganges.",
            myths: "It is believed that when the 'Nar and Narayana' peaks meet, the current Badrinath temple will vanish and appear at Bhavishya Badri."
        },
        imageUrl: "assets/destinations/badrinath_1.jpg",
        galleryImages: ["assets/destinations/badrinath_1.jpg"],
        entryFee: "Free",
        bestTime: "May to June, September to October",
        isPublished: true,
        isFeatured: true
    },
    {
        name: "Jagannath Temple",
        city: "Puri",
        state: "Odisha",
        country: "India",
        location: "Puri, Odisha",
        coordinates: { latitude: 19.8047, longitude: 85.8186 },
        category: "Heritage",
        type: "Spiritual",
        rating: 4.8,
        description: "A significant Hindu temple dedicated to Lord Jagannath, famous for its annual Rath Yatra.",
        detailedInfo: {
            introduction: "The Jagannath Temple in Puri is one of the holiest Char Dham sites. It is a center of deep devotion and unique traditions.",
            history: "Built by King Anantavarman Chodaganga Deva in the 12th century. The temple is one of India's most visited spiritual centers.",
            significance: "Dedicated to Lord Jagannath, Balabhadra, and Subhadra. It is famous for its massive kitchen (Mahaprasad).",
            architecture: "Classic Kalinga style architecture with a massive 214-foot high main tower (Vimana) topped by the Nilachakra.",
            visitingInfo: "Open from 5:00 AM to 11:00 PM. Access restricted to Hindus only.",
            keyFacts: [
                "The temple flag always flaps opposite to the wind",
                "Nothing flies over the temple - no birds, no planes",
                "The Mahaprasad is cooked in 7 earthen pots placed on top of each other"
            ]
        },
        culturalVault: {
            history: "The temple was built to house the 'Daru' (wooden) idols of the deities, which are renewed every 12 or 19 years (Nabakalebara).",
            stories: "The annual Rath Yatra is the oldest and largest chariot festival in the world.",
            myths: "It is believed that the heart of Krishna is hidden inside the idol of Jagannath (the Brahma Padartha)."
        },
        imageUrl: "assets/destinations/puri_jagannath_1.jpg",
        galleryImages: ["assets/destinations/puri_jagannath_1.jpg"],
        entryFee: "Free",
        bestTime: "October to March",
        isPublished: true,
        isFeatured: true
    },
    {
        name: "Meenakshi Temple",
        city: "Madurai",
        state: "Tamil Nadu",
        country: "India",
        location: "Madurai, Tamil Nadu",
        coordinates: { latitude: 9.9195, longitude: 78.1193 },
        category: "Heritage",
        type: "Historical",
        rating: 4.8,
        description: "An ancient temple complex in Madurai, a masterpiece of Dravidian architecture.",
        detailedInfo: {
            introduction: "Meenakshi Amman Temple is a historic Hindu temple located on the southern bank of the Vaigai River. It is the heart of the 2,500-year-old city of Madurai.",
            history: "Dating back to the 7th century, it was looted by Malik Kafur in the 14th century and beautifully rebuilt by the Nayak rulers in the 16th century.",
            significance: "Dedicated to Goddess Meenakshi (an avatar of Parvati) and her consort Sundareswarar (Shiva).",
            architecture: "Famous for its 14 towering gopurams, the 'Hall of Thousand Pillars', and the sacred Golden Lotus Pond.",
            visitingInfo: "Open from 5:00 AM to 12:30 PM, and 4:00 PM to 9:30 PM. Photography is restricted inside.",
            keyFacts: [
                "The temple complex houses over 33,000 sculptures",
                "The 1000-pillar hall has only 985 pillars, each carved with mythical beasts",
                "Voted as one of the best heritage sites in India"
            ]
        },
        culturalVault: {
            history: "The temple was the center of the Tamil Sangam literature and the capital of the Pandyan dynasty.",
            stories: "The grand wedding festival (Chithirai Thiruvizha) of Meenakshi and Shiva attracts millions of devotees yearly.",
            myths: "Goddess Meenakshi is said to have been born with three breasts, and the third one disappeared only when she met Lord Sundareswarar."
        },
        imageUrl: "assets/destinations/madurai_meenakshi_1.jpg",
        galleryImages: ["assets/destinations/madurai_meenakshi_1.jpg"],
        entryFee: "Free",
        bestTime: "October to March",
        isPublished: true,
        isFeatured: true
    },
    {
        name: "Sanchi Stupa",
        city: "Sanchi",
        state: "Madhya Pradesh",
        country: "India",
        location: "Sanchi, Madhya Pradesh",
        coordinates: { latitude: 23.4793, longitude: 77.7397 },
        category: "Heritage",
        type: "Historical",
        rating: 4.7,
        description: "One of the oldest stone structures in India and a significant Buddhist monument.",
        detailedInfo: {
            introduction: "Sanchi Stupa is a UNESCO World Heritage site and a key centerpiece of Buddhist art and architecture.",
            history: "Originally commissioned by Emperor Ashoka in the 3rd century BCE to house relics of the Buddha.",
            significance: "Represents the life and journeys of Buddha through symbolic carvings on its four gateways (Toranas).",
            architecture: "A hemispherical brick dome (anda) with a stone umbrella (chhatra) on top, surrounded by a stone fence.",
            visitingInfo: "Open from 6:30 AM to 6:30 PM. Located 46km from Bhopal.",
            keyFacts: [
                "The carvings depict Jataka tales - stories of Buddha's previous births",
                "Empress Ashoka's image appears on the 200 rupee note along with Sanchi Stupa",
                "It was abandoned for nearly 600 years before being rediscovered in 1818"
            ]
        },
        culturalVault: {
            history: "The site was a flourishing center of Buddhist learning until the 12th century AD.",
            stories: "The Ashoka Pillar at Sanchi is famous for its mirror-like polish and Brahmi inscriptions.",
            myths: "The gateways were funded by local ivory carvers from Vidisha, who applied their delicate craft to stone."
        },
        imageUrl: "assets/destinations/sanchi_stupa_1.jpg",
        galleryImages: ["assets/destinations/sanchi_stupa_1.jpg"],
        entryFee: "₹30 (Indian), ₹500 (Foreign)",
        bestTime: "November to March",
        isPublished: true,
        isFeatured: true
    }
];

async function addHeritageSites() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        for (const dest of destinations) {
            const existing = await Place.findOne({ name: dest.name });
            if (existing) {
                console.log(`Skipping: ${dest.name} already exists.`);
                continue;
            }

            const newPlace = new Place(dest);
            await newPlace.save();
            console.log(`✅ Added: ${dest.name}`);

            const activity = new Activity({
                type: 'destination_added',
                message: `New destination added: ${dest.name}`,
                metadata: {
                    placeId: newPlace._id,
                    placeName: dest.name,
                    admin: 'System'
                }
            });
            await activity.save();
        }

        console.log('--- Heritage Sites Addition Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

addHeritageSites();
