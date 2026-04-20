const express = require('express');
const router = express.Router();
const TravelPackage = require('../models/TravelPackage');

// @route   GET /api/packages
// @desc    Get all published travel packages
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, featured, limit } = req.query;

        const filter = { isPublished: true };
        if (category) filter.category = category;
        if (featured === 'true') filter.isFeatured = true;

        const packages = await TravelPackage
            .find(filter)
            .sort({ sortOrder: 1, createdAt: -1 })
            .limit(parseInt(limit) || 20);

        res.json(packages);
    } catch (err) {
        console.error('Error fetching packages:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/packages/:id
// @desc    Get single package details by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const pkg = await TravelPackage.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ msg: 'Package not found' });
        }
        res.json(pkg);
    } catch (err) {
        console.error('Error fetching package:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Package not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
