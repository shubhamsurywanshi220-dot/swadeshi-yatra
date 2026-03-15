const mongoose = require('mongoose');

const SOSSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    locationHistory: [{
        latitude: Number,
        longitude: Number,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    message: {
        type: String,
        default: 'SOS Alert Activated'
    },
    emergencyContact: {
        name: String,
        phone: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SOS', SOSSchema);
