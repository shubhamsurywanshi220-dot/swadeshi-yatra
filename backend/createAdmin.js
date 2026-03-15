require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@swadeshiyatra.com' });

        if (existingAdmin) {
            console.log('🔄 Admin user already exists. Updating password...');
            const salt = await bcrypt.genSalt(10);
            existingAdmin.password = await bcrypt.hash('admin@123', salt);
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('✅ Admin password updated successfully!');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin@123', salt);

        // Create admin user
        const admin = new User({
            name: 'Admin',
            email: 'admin@swadeshiyatra.com',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@swadeshiyatra.com');
        console.log('🔑 Password: admin@123');
        console.log('\n⚡ You can now login to the admin panel!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();