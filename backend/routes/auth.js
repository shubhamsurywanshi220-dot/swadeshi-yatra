const express = require('express');
const router = express.Router();
const User = require('../models/User');

// NOTE: In a real app, use bcrypt for password hashing and jsonwebtoken for tokens.
// For this MVP demonstration, we will store plain text (NOT SECURE) to fulfill the functional requirement quickly.

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        await user.save();
        res.json({ msg: 'Registration Successful', userId: user.id, name: user.name });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (mock)
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (user.password !== password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        res.json({
            msg: 'Login Successful',
            userId: user.id,
            name: user.name,
            role: user.role
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
