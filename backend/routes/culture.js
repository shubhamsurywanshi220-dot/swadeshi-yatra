const express = require('express');
const router = express.Router();
const Culture = require('../models/Culture');
const auth = require('../middleware/auth');

// @route   GET /api/culture/:placeId
// @desc    Get cultural stories for a specific place
// @access  Public
router.get('/:placeId', async (req, res) => {
    try {
        const stories = await Culture.find({ placeId: req.params.placeId });
        res.json(stories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/culture
// @desc    Add a cultural story (Admin/Contributor)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { placeId, title, category, content, audioUrl, imageUrl } = req.body;

        const newStory = new Culture({
            placeId,
            title,
            category,
            content,
            audioUrl,
            imageUrl
        });

        const story = await newStory.save();
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
