const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📦 Collections in database:', collections.map(c => c.name));
        
        for (const coll of collections) {
            const count = await db.collection(coll.name).countDocuments();
            console.log(` - ${coll.name}: ${count} documents`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

diagnose();
