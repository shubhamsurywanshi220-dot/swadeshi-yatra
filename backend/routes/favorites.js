const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/favorites/add
// @desc    Add a place to user's favorites
// @access  Public (should be protected in production)
router.post('/add', async (req, res) => {
    const { userId, placeId } = req.body;

    try {
        if (!userId || !placeId) {
            return res.status(400).json({ msg: 'User ID and Place ID are required' });
        }

        console.log('Adding to favorites:', { userId, placeId });

        // For now, if userId is placeholder, return success without DB operation
        if (userId === 'user_dynamic_placeholder') {
            console.log('Using placeholder user, skipping DB operation');
            return res.json({ msg: 'Added to favorites (placeholder mode)', favorites: [placeId] });
        }

        const user = await User.findById(userId);

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
        console.error('Full error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   DELETE /api/favorites/remove/:placeId
// @desc    Remove a place from user's favorites
// @access  Public (should be protected in production)
router.delete('/remove/:placeId', async (req, res) => {
    const { userId } = req.body;
    const { placeId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' });
        }

        console.log('Removing from favorites:', { userId, placeId });

        // For now, if userId is placeholder, return success without DB operation
        if (userId === 'user_dynamic_placeholder') {
            console.log('Using placeholder user, skipping DB operation');
            return res.json({ msg: 'Removed from favorites (placeholder mode)', favorites: [] });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.favorites = user.favorites.filter(id => id.toString() !== placeId);
        await user.save();

        res.json({ msg: 'Removed from favorites', favorites: user.favorites });

    } catch (err) {
        console.error('Error in DELETE /api/favorites/remove:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   GET /api/favorites/:userId
// @desc    Get user's favorite places
// @access  Public
router.get('/:userId', async (req, res) => {
    try {
        console.log('Fetching favorites for userId:', req.params.userId);

        // For now, if userId is placeholder, return empty array
        if (req.params.userId === 'user_dynamic_placeholder') {
            console.log('Using placeholder user, returning empty favorites');
            return res.json([]);
        }

        const user = await User.findById(req.params.userId).populate('favorites');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user.favorites);

    } catch (err) {
        console.error('Error in GET /api/favorites/:userId:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   POST /api/favorites/visited/add
// @desc    Mark a place as visited
// @access  Public
router.post('/visited/add', async (req, res) => {
    const { userId, placeId } = req.body;

    try {
        if (!userId || !placeId) {
            return res.status(400).json({ msg: 'User ID and Place ID are required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Initialize visitedPlaces if it doesn't exist
        if (!user.visitedPlaces) {
            user.visitedPlaces = [];
        }

        // Check if already marked as visited (more robust check)
        const isAlreadyVisited = user.visitedPlaces.some(id => id.toString() === placeId.toString());

        if (!isAlreadyVisited) {
            user.visitedPlaces.push(placeId);
            await user.save();
        }

        res.json({ msg: 'Marked as visited', visitedPlaces: user.visitedPlaces });

    } catch (err) {
        console.error('Error in /visited/add:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
