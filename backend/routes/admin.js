const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Place = require('../models/Place');
const Business = require('../models/Business');
const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const SOS = require('../models/SOS');
const Review = require('../models/Review');
const Activity = require('../models/Activity');
const TravelPackage = require('../models/TravelPackage');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication to all routes in this file
router.use(adminAuth);

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Admin
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const placeCount = await Place.countDocuments();
        const businessCount = await Business.countDocuments();
        const bookingCount = await Ticket.countDocuments(); // Use Ticket model
        const sosCount = await SOS.countDocuments({ status: 'active' });

        // EXPECTED DATA COUNT VERIFICATION
        const EXPECTED_PLACES = 412; // Base registry count
        if (placeCount !== EXPECTED_PLACES) {
            console.warn(`[SYNC WARNING] Data mismatch detected! Expected ${EXPECTED_PLACES} places, but DB has ${placeCount}. Please run node scripts/sync_all_destinations.js`);
        } else {
            console.log(`[SYNC OK] All ${EXPECTED_PLACES} destinations are perfectly synchronized.`);
        }

        res.json({
            users: userCount,
            places: placeCount,
            businesses: businessCount,
            bookings: bookingCount,
            activeSOS: sosCount
        });
    } catch (err) {
        console.error('Error fetching admin stats:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/block
// @desc    Block/Unblock a user
// @access  Admin
router.put('/users/:id/status', async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isBlocked = isBlocked; // Ensure this field exists or just mock for now
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/places
// @desc    Get all places
// @access  Admin
router.get('/places', async (req, res) => {
    try {
        const places = await Place.find().sort({ createdAt: -1 });
        res.json(places);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/admin/places
// @desc    Add a new place
// @access  Admin
router.post('/places', async (req, res) => {
    try {
        const newPlace = new Place(req.body);
        const place = await newPlace.save();
        
        // Emit socket event for real-time update
        if (req.io) {
            req.io.emit('place_added', place);
        }

        res.json(place);
    } catch (err) {
        console.error('Error adding place:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/places/:id
// @desc    Update a place
// @access  Admin
router.put('/places/:id', async (req, res) => {
    try {
        const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // Emit socket event for real-time update
        if (req.io) {
            req.io.emit('place_updated', place);
        }

        res.json(place);
    } catch (err) {
        console.error('Error updating place:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/places/:id
// @desc    Delete a place
// @access  Admin
router.delete('/places/:id', async (req, res) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        
        // Emit socket event for real-time update
        if (req.io) {
            req.io.emit('place_removed', { id: req.params.id });
        }

        res.json({ msg: 'Place removed' });
    } catch (err) {
        console.error('Error deleting place:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/businesses
// @desc    Get all businesses/vendors
// @access  Admin
router.get('/businesses', async (req, res) => {
    try {
        const businesses = await Business.find().sort({ createdAt: -1 });
        res.json(businesses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/businesses/:id/verify
// @desc    Verify a business
// @access  Admin
router.put('/businesses/:id/verify', async (req, res) => {
    try {
        const { isVerified } = req.body;
        const business = await Business.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });
        res.json(business);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Admin
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Ticket.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/bookings/:id/status
// @desc    Update booking status
// @access  Admin
router.put('/bookings/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/sos
// @desc    Get active SOS alerts
// @access  Admin
router.get('/sos', async (req, res) => {
    try {
        const sosAlerts = await SOS.find().populate('user', 'name email phone').sort({ timestamp: -1 });
        res.json(sosAlerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/sos/:id/resolve
// @desc    Resolve an SOS alert
// @access  Admin
router.put('/sos/:id/resolve', async (req, res) => {
    try {
        const sos = await SOS.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
        res.json(sos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews for moderation
// @access  Admin
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name').populate('place', 'name').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete a review
// @access  Admin
router.delete('/reviews/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/activities
// @desc    Get recent system activities
// @access  Admin
router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 }).limit(20);
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/charts
// @desc    Get data for dashboard charts
// @access  Admin
router.get('/charts', async (req, res) => {
    try {
        // Daily Users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const dailyUsers = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                count: { $sum: 1 } 
            } },
            { $sort: { _id: 1 } }
        ]);

        // Booking Trends (last 7 days)
        const dailyBookings = await Ticket.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                count: { $sum: 1 } 
            } },
            { $sort: { _id: 1 } }
        ]);

        // Most visited destinations (Top 5)
        const topDestinations = await Ticket.aggregate([
            { $group: { 
                _id: "$placeName", 
                count: { $sum: 1 } 
            } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            dailyUsers,
            dailyBookings,
            topDestinations
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ============================================================
// TRAVEL PACKAGES - Admin CRUD
// ============================================================

// @route   GET /api/admin/packages
// @desc    Get all travel packages (including unpublished)
// @access  Admin
router.get('/packages', async (req, res) => {
    try {
        const packages = await TravelPackage.find().sort({ sortOrder: 1, createdAt: -1 });
        res.json(packages);
    } catch (err) {
        console.error('Error fetching packages:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/admin/packages
// @desc    Create a new travel package
// @access  Admin
router.post('/packages', async (req, res) => {
    try {
        const newPackage = new TravelPackage(req.body);
        const pkg = await newPackage.save();

        // Emit socket event for real-time sync to mobile
        if (req.io) {
            req.io.emit('package_added', pkg);
        }

        res.json(pkg);
    } catch (err) {
        console.error('Error creating package:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   PUT /api/admin/packages/:id
// @desc    Update a travel package
// @access  Admin
router.put('/packages/:id', async (req, res) => {
    try {
        const pkg = await TravelPackage.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!pkg) {
            return res.status(404).json({ msg: 'Package not found' });
        }

        if (req.io) {
            req.io.emit('package_updated', pkg);
        }

        res.json(pkg);
    } catch (err) {
        console.error('Error updating package:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   DELETE /api/admin/packages/:id
// @desc    Delete a travel package
// @access  Admin
router.delete('/packages/:id', async (req, res) => {
    try {
        const pkg = await TravelPackage.findByIdAndDelete(req.params.id);

        if (!pkg) {
            return res.status(404).json({ msg: 'Package not found' });
        }

        if (req.io) {
            req.io.emit('package_removed', { id: req.params.id });
        }

        res.json({ msg: 'Package removed' });
    } catch (err) {
        console.error('Error deleting package:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
