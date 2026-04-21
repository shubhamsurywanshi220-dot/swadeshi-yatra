const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/swadeshi_yatra';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const db = mongoose.connection.db;

        const users = await db.collection('users').find({}).toArray();
        console.log('== USERS IN DATABASE ==');
        if (users.length === 0) {
            console.log('No users found in database!');
            
            // Create a test user
            console.log('\nCreating a test user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            
            await db.collection('users').insertOne({
                name: 'Test Traveler',
                email: 'test@travel.com',
                password: hashedPassword,
                role: 'traveler',
                createdAt: new Date()
            });
            console.log('Created test user: test@travel.com / password123');
        } else {
            users.forEach(u => {
                console.log(`Email: ${u.email} | Role: ${u.role}`);
            });
            console.log('\nIf the user above is typing wrong credentials, use the Emails listed above.');
        }

        mongoose.connection.close();
    })
    .catch(console.error);
