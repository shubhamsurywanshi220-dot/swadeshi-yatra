const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// @route   GET /api/places
// @desc    Get all places
// @access  Public
router.get('/', async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const richPlaces = require('../data/allPlaces');

        const hasValidImage = (place) => {
            // Check for imageUrl
            if (place.imageUrl) {
                if (place.imageUrl.startsWith('http')) return true;
                if (place.imageUrl.startsWith('/')) {
                    const relativePath = place.imageUrl.slice(1);
                    const localPath = path.join(__dirname, '../public', relativePath);
                    return fs.existsSync(localPath);
                }
            }
            
            // Check for images array or gallery
            if (place.images && place.images.length > 0) return true;
            if (place.gallery && place.gallery.length > 0) return true;
            if (place.detailedInfo?.additionalImages && place.detailedInfo.additionalImages.length > 0) return true;

            return false;
        };

        // Sort: places with images first
        const sortedPlaces = [...richPlaces].sort((a, b) => {
            const aHasImage = hasValidImage(a);
            const bHasImage = hasValidImage(b);
            if (aHasImage && !bHasImage) return -1;
            if (!aHasImage && bHasImage) return 1;
            return 0;
        });

        console.log(`[API] Serving ${sortedPlaces.length} places (Sorted by image presence)`);
        res.json(sortedPlaces);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
