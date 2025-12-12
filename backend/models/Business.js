const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String, // 'Artisan', 'Guide', 'Hotel', 'Restaurant'
        required: true
    },
    location: {
        type: String,
        required: true
    },
    ownerName: {
        type: String
    },
    contactNumber: {
        type: String
    },
    description: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String
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
    state: {
        type: String
    },
    city: {
        type: String
    },
    contactInfo: {
        phone: String,
        email: String,
        website: String,
        whatsapp: String
    },
    businessHours: {
        type: String // 'Mon-Sat: 9AM-6PM'
    },
    priceRange: {
        type: String // '₹₹', '₹₹₹', etc.
    },
    coordinates: {
        latitude: Number,
        longitude: Number
    }
});

module.exports = mongoose.model('Business', BusinessSchema);
