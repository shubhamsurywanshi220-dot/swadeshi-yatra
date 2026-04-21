const mongoose = require('mongoose');

const VlogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    video_url: { type: String, required: true },
    thumbnail: { type: String, default: null },
    location: { type: String, required: true },
    destination_id: { type: String, default: null },
    user: { type: String, required: true },             // User display name
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    category: {
        type: String,
        enum: ['Nature', 'Heritage', 'Adventure', 'Food', 'Culture', 'General'],
        default: 'General'
    },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'flagged'],
        default: 'approved' // Option A: Upload -> Directly visible
    },
    flaggedReason: { type: String, default: null },
    duration: { type: String, default: null },
}, { timestamps: true });

// Indexes for common queries
VlogSchema.index({ location: 'text', title: 'text' });
VlogSchema.index({ views: -1 });
VlogSchema.index({ category: 1 });
VlogSchema.index({ destination_id: 1 });
VlogSchema.index({ status: 1 });

module.exports = mongoose.model('Vlog', VlogSchema);
