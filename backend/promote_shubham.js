require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User ${email} not found.`);
            process.exit(1);
        }
        user.role = 'admin';
        await user.save();
        console.log(`✅ User ${email} promoted to admin successfully!`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

promoteUser('shubhamsurywanshi220@gmail.com');
