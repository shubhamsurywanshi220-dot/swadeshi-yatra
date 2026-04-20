const mongoose = require('mongoose');

const VlogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    video_url: { type: String, default: null },        // Cloudinary / Firebase / direct URL
    thumbnail: { type: String, default: null },         // Auto-generated or user-provided
    location: { type: String, required: true },         // e.g. "Hampi, Karnataka"
    destination_id: { type: String, default: null },    // Links to a Place document _id
    user: { type: String, required: true },             // Display name
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    description: { type: String, default: '' },
    category: {
        type: String,
        enum: ['Nature', 'Heritage', 'Adventure', 'Food', 'Culture', 'General'],
        default: 'General'
    },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    flaggedReason: { type: String, default: null }, // e.g. "Fake", "Inappropriate"
    duration: { type: String, default: null },
}, { timestamps: true });

// Indexes for common queries
VlogSchema.index({ location: 'text', title: 'text' });
VlogSchema.index({ views: -1 });
VlogSchema.index({ category: 1 });
VlogSchema.index({ destination_id: 1 });
VlogSchema.index({ status: 1 });

module.exports = mongoose.model('Vlog', VlogSchema);
