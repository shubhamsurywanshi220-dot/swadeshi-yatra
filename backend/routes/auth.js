const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    let { name, email, password, role } = req.body;
    email = email.toLowerCase();

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'traveler'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' },
            async (err, token) => {
                if (err) throw err;
                
                // Emit real-time event
                if (req.io) {
                    req.io.emit('user_registered', {
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    });
                }

                // Log Activity
                try {
                    const activity = new Activity({
                        type: 'user_registered',
                        message: `New user registered: ${user.name}`,
                        metadata: { userId: user.id, email: user.email }
                    });
                    await activity.save();
                } catch (actErr) {
                    console.error('Activity Logging Error:', actErr.message);
                }

                res.json({ token, userId: user.id, name: user.name, role: user.role });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Check if it's a plain text password (for migration)
            if (user.password === password) {
                console.log(`Migrating plain-text password for user: ${email}`);
                // Auto-migrate to hashed password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();
            } else {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    userId: user.id,
                    name: user.name,
                    role: user.role
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/auth/profile/:userId
// @desc    Get user profile stats
// @access  Public
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({
            name: user.name,
            email: user.email,
            role: user.role,
            tripsCount: user.visitedPlaces ? user.visitedPlaces.length : 0,
            visitedPlaces: user.visitedPlaces || [],
            favoritesCount: user.favorites ? user.favorites.length : 0,
            favorites: user.favorites || [],
            createdAt: user.createdAt
        });

    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

const auth = require('../middleware/auth');

// @route   POST /api/auth/profile/update
// @desc    Update user profile
// @access  Private
router.post('/profile/update', auth, async (req, res) => {
    const { name, email, phone, profilePhoto } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email.toLowerCase();
    if (phone) profileFields.phone = phone;
    if (profilePhoto) profileFields.profilePhoto = profilePhoto;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if email is being changed and if it already exists
        if (email && email.toLowerCase() !== user.email) {
            let emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
