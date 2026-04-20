const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const allPlaces = require('./data/allPlaces');
const Place = require('./models/Place');
const Activity = require('./models/Activity');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Pass io to routes via middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Serve static files from the public directory
app.use(express.static('public'));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// MongoDB Connection
// For now, we will use a local URI or a placeholder. 
// In a real scenario, this comes from .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

mongoose.connect(MONGO_URI, { dbName: 'swadeshi_yatra' })
    .then(async () => {
        console.log('✅ MongoDB Connected to database:', mongoose.connection.name);
        
        // AUTO-SYNC REGISTRY ON STARTUP
        await autoSyncPlaces();
    })
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Auto-Sync Logic (Ensures 412 destinations)
async function autoSyncPlaces() {
    try {
        const dbCount = await Place.countDocuments();
        const registryCount = allPlaces.length;

        if (dbCount === registryCount) {
            console.log(`📡 [AUTO-SYNC] Integrity Verified: DB and Registry are perfectly aligned (${dbCount}/${registryCount}).`);
            return;
        }

        console.log(`📡 [AUTO-SYNC] Synchronizing ${registryCount} destinations... (Current: ${dbCount})`);

        let added = 0;
        let updated = 0;

        for (const p of allPlaces) {
            const result = await Place.findOneAndUpdate(
                { name: p.name, city: p.city },
                { $set: { ...p, isPublished: true, type: p.type || 'Nature' } },
                { upsert: true, new: true }
            );
            
            // Check if it was newly created
            if (result.createdAt && result.updatedAt && result.createdAt.getTime() === result.updatedAt.getTime()) {
                added++;
            } else {
                updated++;
            }
        }

        const finalCount = await Place.countDocuments();
        console.log(`✅ [AUTO-SYNC] Complete! Added: ${added}, Updated: ${updated}. Final DB Count: ${finalCount}/${registryCount}`);
        
        // Notify any connected Admin Panels to refresh stats
        if (io) {
            io.emit('place_added', { count: finalCount });
        }
    } catch (error) {
        console.error('❌ [AUTO-SYNC] Critical error during synchronization:', error.message);
    }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/culture', require('./routes/culture'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/vlogs', require('./routes/vlogs'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/upload', require('./routes/upload'));

app.get('/', (req, res) => {
    res.send('Swadeshi Yatra Backend Configured');
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use, retrying with ${parseInt(PORT) + 1}...`);
        server.listen(parseInt(PORT) + 1);
    } else {
        console.error(err);
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
