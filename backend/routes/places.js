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

        // Dynamic Filter: Only return places where the image file actually exists locally
        // This effectively "hides" places until the user adds their image.
        const availablePlaces = richPlaces.filter(place => {
            // Keep external URLs (starting with http)
            if (place.imageUrl && place.imageUrl.startsWith('http')) return true;

            // For local paths (starting with /)
            if (place.imageUrl && place.imageUrl.startsWith('/')) {
                // Remove leading slash to ensure path.join appends instead of replacing
                const relativePath = place.imageUrl.startsWith('/') ? place.imageUrl.slice(1) : place.imageUrl;
                // Construct absolute path: backend/public/images/filename.jpg
                const localPath = path.join(__dirname, '../public', relativePath);

                const exists = fs.existsSync(localPath);
                if (!exists) {
                    console.log(`[FILTER] Hiding ${place.name}: Image missing at ${localPath}`);
                }
                return exists;
            }

            return false; // Hide if no valid image URL
        });

        console.log(`[API] Serving ${availablePlaces.length} places (Filtered from ${richPlaces.length})`);
        res.json(availablePlaces);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
