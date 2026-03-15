const mongoose = require('mongoose');

const CultureSchema = new mongoose.Schema({
    placeId: {
        type: String, // Can be regular String or ObjectId
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String, // 'Story', 'Myth', 'Architectural Fact', 'Tradition'
        required: true
    },
    content: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String // Optional audio narration link
    },
    imageUrl: {
        type: String
    },
    contributorName: {
        type: String,
        default: 'Swadeshi Yatra'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Culture', CultureSchema);
