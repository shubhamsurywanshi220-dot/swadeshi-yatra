const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const users = await User.find({});
        console.log(`Found ${users.length} users. Checking for duplicates and normalizing emails...`);

        const emailMap = new Map();
        const usersToDelete = [];

        for (const user of users) {
            const normalizedEmail = user.email.toLowerCase();

            if (emailMap.has(normalizedEmail)) {
                // Duplicate found (case-insensitive)
                const existingUser = emailMap.get(normalizedEmail);
                console.log(`Duplicate found: ${user.email} (ID: ${user._id}) conflicts with ${existingUser.email} (ID: ${existingUser._id})`);

                // Strategy: Keep the one with more data or the newer/older one.
                // For now, let's just log it and maybe suggest manual cleanup if it's complex.
                // But generally, we should merge or delete the "wrong" one.
                // If the user just tried to sign up and failed, they might have created a partial record.
                console.log(`Recommendation: Manually inspect and merge these accounts if necessary.`);
            } else {
                emailMap.set(normalizedEmail, user);
            }

            if (user.email !== normalizedEmail) {
                console.log(`Normalizing: ${user.email} -> ${normalizedEmail}`);
                user.email = normalizedEmail;
                await user.save();
            }
        }

        console.log('Normalization complete.');
        process.exit();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
