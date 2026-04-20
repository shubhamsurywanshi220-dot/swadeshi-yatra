const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');

// @route   POST /api/ai/itinerary
// @desc    Generate a personalized travel itinerary
// @access  Private
router.post('/itinerary', auth, async (req, res) => {
    try {
        const preferences = req.body;
        const itinerary = await aiService.generateItinerary(preferences);
        res.json(itinerary);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/ai/insights/:placeName
// @desc    Get cultural insights for a place
// @access  Public
router.get('/insights/:placeName', async (req, res) => {
    try {
        const insights = await aiService.getCulturalInsights(req.params.placeName);
        res.json({ insights });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
