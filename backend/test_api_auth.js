const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function testApiWithToken() {
    // Mock an admin user payload (assuming an admin with this ID exists or just bypassing the DB check if I can)
    // Wait, the middleware checks the DB: const user = await User.findById(decoded.user.id);
    // So I need a real admin ID.
    
    // Let's try to find an admin user first.
    const mongoose = require('mongoose');
    const User = require('./models/User');
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';
    
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' });
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin user found in DB');
            return;
        }
        
        const payload = { user: { id: admin.id, role: 'admin' } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        
        console.log('Using token for admin:', admin.email);
        
        const config = { headers: { 'x-auth-token': token } };
        
        console.log('Testing /api/admin/stats...');
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
        console.log('Stats:', statsRes.data);
        
        console.log('Testing /api/admin/charts...');
        const chartsRes = await axios.get('http://localhost:5000/api/admin/charts', config);
        console.log('Charts:', chartsRes.data);
        
        console.log('Testing /api/admin/activities...');
        const activityRes = await axios.get('http://localhost:5000/api/admin/activities', config);
        console.log('Activities count:', activityRes.data.length);
        
    } catch (err) {
        console.error('Error:', err.response ? err.response.status : err.message);
        if (err.response && err.response.data) console.error('Data:', err.response.data);
        if (err.stack) console.error(err.stack);
    } finally {
        mongoose.connection.close();
    }
}

testApiWithToken();
