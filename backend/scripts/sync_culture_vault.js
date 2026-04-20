const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Culture = require('../models/Culture');
const allPlaces = require('../data/allPlaces');

dotenv.config({ path: path.join(__dirname, '../.env') });

const syncCulture = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';
        console.log('Connecting to MongoDB...', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected.');

        // We only want to add stories for the NEW destinations we just added
        // These have IDs starting with ka_ext, ka_new, ka_req
        const newPlaces = allPlaces.filter(p => 
            p.id.startsWith('ka_ext') || 
            p.id.startsWith('ka_new') || 
            p.id.startsWith('ka_req')
        );

        console.log(`Found ${newPlaces.length} new places to process.`);

        const storiesToInsert = [];

        newPlaces.forEach(place => {
            if (!place.detailedInfo) return;

            const { history, cultural_significance, architecture, interesting_facts } = place.detailedInfo;

            if (history) {
                storiesToInsert.push({
                    placeId: place.id,
                    title: `Historical Significance of ${place.name}`,
                    category: 'Story',
                    content: history,
                    contributorName: 'Swadeshi Yatra Team'
                });
            }

            if (cultural_significance) {
                storiesToInsert.push({
                    placeId: place.id,
                    title: `Cultural Heritage of ${place.name}`,
                    category: 'Tradition',
                    content: cultural_significance,
                    contributorName: 'Swadeshi Yatra Team'
                });
            }

            if (architecture) {
                storiesToInsert.push({
                    placeId: place.id,
                    title: `Architectural Marvel: ${place.name}`,
                    category: 'Architectural Fact',
                    content: architecture,
                    contributorName: 'Swadeshi Yatra Team'
                });
            }

            if (interesting_facts) {
                storiesToInsert.push({
                    placeId: place.id,
                    title: `Did You Know? - ${place.name}`,
                    category: 'Story',
                    content: interesting_facts,
                    contributorName: 'Swadeshi Yatra Team'
                });
            }
        });

        if (storiesToInsert.length > 0) {
            console.log(`Inserting ${storiesToInsert.length} cultural stories...`);
            // We use insertMany but we might want to avoid duplicates if re-run
            // For simplicity in this fix, we'll just insert. 
            // In a real app we'd check for existing stories with the same title/placeId.
            await Culture.insertMany(storiesToInsert);
            console.log('✅ Successfully inserted cultural stories.');
        } else {
            console.log('No new stories to insert.');
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error syncing culture data:', error);
        process.exit(1);
    }
};

syncCulture();
