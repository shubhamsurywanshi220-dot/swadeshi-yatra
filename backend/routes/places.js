const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// @route   GET /api/places
// @desc    Get all places
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Fetch all published places from MongoDB
        const places = await Place.find({ isPublished: { $ne: false } }).sort({ isFeatured: -1, name: 1 });

        const hasValidImage = (place) => {
            if (place.imageUrl && place.imageUrl.startsWith('http')) return true;
            if (place.galleryImages && place.galleryImages.length > 0) return true;
            if (place.images && place.images.length > 0) return true;
            return false;
        };

        // Sort: places with images first (secondary sort after featured)
        const sortedPlaces = [...places].sort((a, b) => {
            const aHasImage = hasValidImage(a);
            const bHasImage = hasValidImage(b);
            if (aHasImage && !bHasImage) return -1;
            if (!aHasImage && bHasImage) return 1;
            return 0;
        });

        console.log(`[API] Serving ${sortedPlaces.length} published places from MongoDB`);
        res.json(sortedPlaces);
    } catch (err) {
        console.error('Error fetching places:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
