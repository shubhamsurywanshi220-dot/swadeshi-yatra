const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String, // City, State
        required: true
    },
    type: {
        type: String, // 'Historical', 'Nature', 'Spiritual', etc.
        default: 'General'
    },
    imageUrl: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    // Enhanced fields for Phase I
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isEcoFriendly: {
        type: Boolean,
        default: false
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    category: {
        type: String // 'Fort', 'Temple', 'Beach', 'Museum', etc.
    },
    bestTime: {
        type: String // 'Oct-Mar', 'Year Round', etc.
    },
    entryFee: {
        type: String // '₹50', 'Free', etc.
    },
    contactInfo: {
        phone: String,
        email: String,
        website: String
    },
    nearbyAttractions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    }],
    coordinates: {
        latitude: Number,
        longitude: Number
    }
});

module.exports = mongoose.model('Place', PlaceSchema);
