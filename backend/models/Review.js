const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: String,  // Changed from ObjectId to String to support placeholder users
        required: true
    },
    placeId: {
        type: String,  // Changed from ObjectId to String to support any place ID format
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
ReviewSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Review', ReviewSchema);
