const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

async function checkAllDBs() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const admin = mongoose.connection.useDb('admin').db.admin();
        const dbs = await admin.listDatabases();

        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (['admin', 'config', 'local'].includes(dbName)) continue;

            const db = mongoose.connection.useDb(dbName);
            const collections = await db.db.listCollections().toArray();
            const hasUsers = collections.some(c => c.name === 'users');

            if (hasUsers) {
                const UserInDB = db.model('User', User.schema);
                const users = await UserInDB.find({});
                console.log(`DB: ${dbName}, Users: ${users.length}`);
                users.forEach(u => {
                    console.log(` - Name: ${u.name}, Email: ${u.email}, Password: ${u.password.substring(0, 10)}...`);
                });
            } else {
                console.log(`DB: ${dbName}, No 'users' collection found.`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkAllDBs();
