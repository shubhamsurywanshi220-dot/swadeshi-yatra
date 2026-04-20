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
        type: String, // City, State0
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
    tags: [{
        type: String // e.g., 'Char Dham Yatra', 'Adventure', etc.
    }],
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
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    bookingEnabled: {
        type: Boolean,
        default: false
    },
    bookingLink: {
        type: String
    },
    reviewsEnabled: {
        type: Boolean,
        default: true
    },
    crowdLevel: {
        type: String, // 'Low', 'Medium', 'High'
        default: 'Medium'
    },
    isHiddenGem: {
        type: Boolean,
        default: false
    },
    galleryImages: [String],
    weatherInfo: String,
    culturalVault: {
        stories: String,
        myths: String,
        history: String
    },
    exploreSurroundings: {
        stay: [{ name: String, link: String }],
        food: [{ name: String, link: String }],
        transport: [{ name: String, link: String }],
        atm: [{ name: String, link: String }]
    },
    detailedInfo: {
        introduction: String,
        keyFacts: [String],
        history: String,
        architecture: String,
        significance: String,
        culturalSignificance: String,
        naturalFeatures: String,
        interestingFacts: String,
        visitingInfo: String,
        additionalImages: [String]
    }
});

module.exports = mongoose.model('Place', PlaceSchema);
