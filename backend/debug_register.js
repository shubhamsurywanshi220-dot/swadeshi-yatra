const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

async function testRegister() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('DB Connected');

        const name = 'Test User';
        const email = 'test' + Date.now() + '@example.com';
        const password = 'password123';
        const role = 'traveler';

        console.log('Step 1: finding user...');
        let user = await User.findOne({ email });
        if (user) {
            console.log('User exists');
            return;
        }

        console.log('Step 2: hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password hashed');

        console.log('Step 3: saving user...');
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'traveler'
        });

        await user.save();
        console.log('User saved successfully');

        process.exit(0);
    } catch (err) {
        console.error('Registration failed at some step:');
        console.error(err);
        process.exit(1);
    }
}

testRegister();
