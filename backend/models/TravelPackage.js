const mongoose = require('mongoose');

const ItineraryDaySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    activities: [String],
    meals: { type: String }, // e.g., 'Breakfast, Lunch, Dinner'
    stay: { type: String }   // e.g., 'Hotel in Manali'
}, { _id: false });

const TravelPackageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String // One-liner for card display
    },
    duration: {
        nights: { type: Number, required: true },
        days: { type: Number, required: true }
    },
    price: {
        original: { type: Number },      // MRP / strikethrough price
        discounted: { type: Number },     // Selling price
        currency: { type: String, default: '₹' },
        perPerson: { type: Boolean, default: true }
    },
    imageUrl: {
        type: String,
        required: true
    },
    galleryImages: [String],
    locations: [{
        type: String // e.g., ['Manali', 'Solang Valley', 'Rohtang Pass']
    }],
    tag: {
        type: String,
        enum: ['Best Seller', 'Trending', 'New', 'Limited Offer', 'Premium', ''],
        default: ''
    },
    category: {
        type: String,
        enum: ['Pilgrimage', 'Adventure', 'Nature', 'Beach', 'Heritage', 'Honeymoon', 'Family', 'Weekend'],
        default: 'Nature'
    },
    itinerary: [ItineraryDaySchema],
    inclusions: [String],   // e.g., ['Hotel Stay', 'Breakfast', 'Transport']
    exclusions: [String],   // e.g., ['Flights', 'Personal Expenses']
    highlights: [String],   // e.g., ['Visit Kedarnath Temple', 'Raft in Rishikesh']
    startingFrom: {
        type: String // City name e.g., 'Delhi', 'Mumbai'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Challenging'],
        default: 'Easy'
    },
    bestSeason: {
        type: String // e.g., 'March - June'
    },
    maxGroupSize: {
        type: Number,
        default: 20
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    bookingCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-generate slug from title before saving
TravelPackageSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('TravelPackage', TravelPackageSchema);
