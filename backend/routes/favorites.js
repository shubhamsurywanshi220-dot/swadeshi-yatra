const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/favorites/add
// @desc    Add a place to user's favorites
// @access  Private
router.post('/add', auth, async (req, res) => {
    const { placeId } = req.body;

    try {
        if (!placeId) {
            return res.status(400).json({ msg: 'Place ID is required' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if already in favorites
        if (user.favorites.includes(placeId)) {
            return res.status(400).json({ msg: 'Place already in favorites' });
        }

        user.favorites.push(placeId);
        await user.save();

        res.json({ msg: 'Added to favorites', favorites: user.favorites });

    } catch (err) {
        console.error('Error in POST /api/favorites/add:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE /api/favorites/remove/:placeId
// @desc    Remove a place from user's favorites
// @access  Private
router.delete('/remove/:placeId', auth, async (req, res) => {
    const { placeId } = req.params;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.favorites = user.favorites.filter(id => id.toString() !== placeId);
        await user.save();

        res.json({ msg: 'Removed from favorites', favorites: user.favorites });

    } catch (err) {
        console.error('Error in DELETE /api/favorites/remove:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/favorites/my
// @desc    Get current user's favorite places
// @access  Private
router.get('/my', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user.favorites);

    } catch (err) {
        console.error('Error in GET /api/favorites/my:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/favorites/visited/add
// @desc    Mark a place as visited
// @access  Private
router.post('/visited/add', auth, async (req, res) => {
    const { placeId } = req.body;

    try {
        if (!placeId) {
            return res.status(400).json({ msg: 'Place ID is required' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Initialize visitedPlaces if it doesn't exist
        if (!user.visitedPlaces) {
            user.visitedPlaces = [];
        }

        // Check if already marked as visited
        const isAlreadyVisited = user.visitedPlaces.some(id => id.toString() === placeId.toString());

        if (!isAlreadyVisited) {
            user.visitedPlaces.push(placeId);
            await user.save();
        }

        res.json({ msg: 'Marked as visited', visitedPlaces: user.visitedPlaces });

    } catch (err) {
        console.error('Error in /visited/add:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
