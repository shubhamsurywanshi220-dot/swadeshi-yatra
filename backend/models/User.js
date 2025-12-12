const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'traveler' // 'traveler', 'guide', 'business'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Enhanced fields for Phase I
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    }],
    visitedPlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    }]
});

module.exports = mongoose.model('User', UserSchema);
