const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// @route   GET /api/businesses
// @desc    Get all businesses
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Mock Data for now
        const businesses = [
            {
                id: 1,
                name: 'Ramesh Handicrafts',
                category: 'Artisan',
                location: 'Jaipur, Rajasthan',
                ownerName: 'Ramesh Kumar',
                contactNumber: '+91-9876543210',
                rating: 4.5,
                description: 'Authentic Rajasthani puppets and textiles.',
                imageUrl: 'https://placehold.co/400x300?text=Handicrafts'
            },
            {
                id: 2,
                name: 'Kerala Spice Garden',
                category: 'Shop',
                location: 'Munnar, Kerala',
                ownerName: 'Jose Thomas',
                contactNumber: '+91-9876543211',
                rating: 4.8,
                description: 'Fresh organic spices direct from the farm.',
                imageUrl: 'https://placehold.co/400x300?text=Spices'
            },
            {
                id: 3,
                name: 'Varanasi Boat Rides',
                category: 'Guide',
                location: 'Varanasi, UP',
                ownerName: 'Ganga Ram',
                contactNumber: '+91-9876543212',
                rating: 4.9,
                description: 'Sunrise boat tours and spiritual storytelling.',
                imageUrl: 'https://placehold.co/400x300?text=Boat'
            }
        ];

        res.json(businesses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
