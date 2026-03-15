const mongoose = require('mongoose');
require('dotenv').config();
const Place = require('./models/Place');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' })
    .then(async () => {
        console.log('✅ MongoDB Connected to database:', mongoose.connection.name);
        
        try {
            const place = await Place.findOne({ $or: [{ name: "Amer Fort" }, { name: "Amber Fort" }] });
            if (place) {
                place.name = "Amber Fort";
                place.description = place.description.replace(/Amer Fort/g, "Amber Fort");
                if (place.detailedInfo && place.detailedInfo.introduction) {
                    place.detailedInfo.introduction = place.detailedInfo.introduction.replace(/Amer Fort/g, "Amber Fort");
                }
                
                await place.save();
                console.log("✅ Successfully updated place name to Amber Fort");
            } else {
                console.log("❌ Place 'Amer Fort' not found in the database. Update skipped.");
            }
        } catch (err) {
            console.error("Error updating place:", err);
        } finally {
            mongoose.connection.close();
            process.exit(0);
        }
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });
