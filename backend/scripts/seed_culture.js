const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Culture = require('../models/Culture');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleCultureData = [
    {
        placeId: 'pb1', // Golden Temple
        title: 'The Legend of Amrit Sarovar',
        category: 'Myth',
        content: 'Legend has it that the Amrit Sarovar (Pool of Nectar) surrounding the Golden Temple has healing properties. It is believed that Rajni, daughter of a proud king, married a leper. She brought him to the pool, and when he dipped in the water, he was miraculously cured of his leprosy. Since then, the sarovar is considered sacred and capable of healing ailments.',
        contributorName: 'Swadeshi Yatra Team',
        imageUrl: '/images/pb_golden_temple.jpg'
    },
    {
        placeId: 'pb1', // Golden Temple
        title: 'Foundation by a Sufi Saint',
        category: 'Story',
        content: 'In a beautiful display of interfaith harmony, the foundation stone of the Golden Temple was laid not by a Sikh Guru, but by a revered Muslim Sufi saint from Lahore, Hazrat Mian Mir. Guru Arjan Dev specifically invited him to lay the stone to emphasize that the temple would be open to all faiths.',
        contributorName: 'Swadeshi Yatra Team'
    },
    {
        placeId: 'pb1', // Golden Temple
        title: 'The Four Doors of Equality',
        category: 'Architectural Fact',
        content: 'Unlike most temples in India that have a single entrance, the Golden Temple has four distinct entrances facing North, South, East, and West. This architectural choice symbolizes that people from all four corners of the world and from all casts, creeds, and backgrounds are equally welcome.',
        contributorName: 'Swadeshi Yatra Team'
    },
    {
        placeId: 'up1', // Taj Mahal
        title: 'The Black Taj Mahal Myth',
        category: 'Myth',
        content: 'A popular legend suggests that Emperor Shah Jahan planned to build an identical Taj Mahal made entirely of black marble across the Yamuna River for his own tomb. However, his son Aurangzeb imprisoned him before the construction could begin, leaving the Black Taj as an enduring myth.',
        contributorName: 'Swadeshi Yatra Team'
    }
];

const seedCulture = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        console.log('Clearing existing culture stories...');
        await Culture.deleteMany({});

        console.log('Seeding new culture stories...');
        await Culture.insertMany(sampleCultureData);
        
        console.log('Successfully seeded culture data!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding culture data:', error);
        process.exit(1);
    }
};

seedCulture();
