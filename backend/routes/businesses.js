const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const auth = require('../middleware/auth');

// @route   GET /api/businesses
// @desc    Get all verified businesses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const query = { isVerified: true };

        // Filter by category if provided, but restrict to allowed categories
        const allowedCategories = ['Guide', 'Artisan', 'Shop'];
        
        if (req.query.category) {
            if (allowedCategories.includes(req.query.category)) {
                query.category = req.query.category;
            } else {
                // If an invalid category is requested, return empty or default filtering
                return res.json([]);
            }
        } else {
            // Default: Only show allowed categories
            query.category = { $in: allowedCategories };
        }

        const businesses = await Business.find(query).sort({ rating: -1 });

        // Final sort: Prioritize those with images
        const sortedBusinesses = [...businesses].sort((a, b) => {
            const aHasImage = !!(a.imageUrl || (a.images && a.images.length > 0));
            const bHasImage = !!(b.imageUrl || (b.images && b.images.length > 0));
            
            if (aHasImage && !bHasImage) return -1;
            if (!aHasImage && bHasImage) return 1;
            return 0;
        });

        res.json(sortedBusinesses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/businesses/register
// @desc    Register a new local service provider
// @access  Private
router.post('/register', auth, async (req, res) => {
    try {
        const {
            name,
            category,
            location,
            ownerName,
            contactNumber,
            description,
            imageUrl,
            state,
            city,
            contactInfo,
            businessHours,
            priceRange
        } = req.body;

        const allowedCategories = ['Guide', 'Artisan', 'Shop'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ msg: `Invalid category. Allowed: ${allowedCategories.join(', ')}` });
        }

        const newBusiness = new Business({
            name,
            category,
            location,
            ownerName,
            contactNumber,
            description,
            imageUrl,
            state,
            city,
            contactInfo,
            businessHours,
            priceRange,
            isVerified: false // Needs admin approval
        });

        const business = await newBusiness.save();
        res.json(business);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/businesses/:id
// @desc    Get business by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);
        if (!business) return res.status(404).json({ msg: 'Business not found' });
        res.json(business);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
