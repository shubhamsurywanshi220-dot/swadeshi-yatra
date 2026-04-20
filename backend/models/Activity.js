const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    type: {
        type: String, // 'user_registered', 'booking_created', 'sos_alert', 'destination_added', 'partner_applied'
        required: true
    },
    message: {
        type: String,
        required: true
    },
    metadata: {
        type: Object, // Extra data like userId, placeId, etc.
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
