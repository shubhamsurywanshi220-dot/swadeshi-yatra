const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SOS = require('../models/SOS');
const Activity = require('../models/Activity');

// @route   POST /api/sos/alert
// @desc    Trigger a new SOS alert
// @access  Private
router.post('/alert', auth, async (req, res) => {
    try {
        const { latitude, longitude, emergencyContact, message } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ msg: 'Location data (latitude, longitude) is required' });
        }

        const newAlert = new SOS({
            user: req.user.id,
            location: { latitude, longitude },
            locationHistory: [{ latitude, longitude }],
            emergencyContact: emergencyContact || { name: 'Emergency Services', phone: '112/100' },
            message: message || 'SOS Alert Activated',
            status: 'active'
        });

        const alert = await newAlert.save();

        // 🚨 IMPORTANT: In a production environment, this is where you'd trigger 
        // Twilio for SMS, Firebase Cloud Messaging for Push notifications, 
        // or a Socket.io event for real-time dashboard updates.

        console.log(`\n🚨 [SOS ALERT] RECEIVED!`);
        console.log(`👤 User ID: ${req.user.id}`);
        console.log(`📍 Location: ${latitude}, ${longitude}`);
        console.log(`📞 Emergency Contact: ${JSON.stringify(newAlert.emergencyContact)}`);
        console.log(`💬 Message: ${newAlert.message}`);
        console.log(`🌐 Maps: https://www.google.com/maps?q=${latitude},${longitude}\n`);

        // Emit real-time event
        if (req.io) {
            req.io.emit('sos_alert', {
                id: alert.id,
                userId: req.user.id,
                name: (await alert.populate('user', 'name')).user.name,
                location: { latitude, longitude },
                message: alert.message,
                timestamp: alert.timestamp
            });
        }

        // Log Activity
        try {
            const userName = (await alert.populate('user', 'name')).user.name;
            const activity = new Activity({
                type: 'sos_alert',
                message: `SOS Alert triggered by ${userName}`,
                metadata: { alertId: alert.id, userId: req.user.id, location: { latitude, longitude } }
            });
            await activity.save();
        } catch (actErr) {
            console.error('Activity Logging Error:', actErr.message);
        }

        res.json(alert);
    } catch (err) {
        console.error('SOS Alert Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/sos/update/:id
// @desc    Update live SOS location tracking
// @access  Private
router.put('/update/:id', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ msg: 'Location data required for update' });
        }

        let alert = await SOS.findById(req.params.id);
        if (!alert) return res.status(404).json({ msg: 'SOS Alert not found' });

        // Ensure user owns the alert
        if (alert.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        if (alert.status !== 'active') {
            return res.status(400).json({ msg: 'Alert is already resolved' });
        }

        // Update current location and push to history
        alert.location = { latitude, longitude };
        alert.locationHistory.push({ latitude, longitude });

        await alert.save();

        console.log(`🛰️ [SOS UPDATE] Alert ${req.params.id} updated to ${latitude}, ${longitude}`);

        if (req.io) {
            req.io.emit('sos_update', {
                id: alert.id,
                location: { latitude, longitude }
            });
        }

        res.json(alert);
    } catch (err) {
        console.error('SOS Update Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/sos/resolve/:id
// @desc    Resolve an SOS alert
// @access  Private
router.put('/resolve/:id', auth, async (req, res) => {
    try {
        let alert = await SOS.findById(req.params.id);
        if (!alert) return res.status(404).json({ msg: 'SOS Alert not found' });

        // Ensure user owns the alert or is an admin (optional check)
        if (alert.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        alert.status = 'resolved';
        await alert.save();

        console.log(`✅ [SOS RESOLVED] Alert ${req.params.id} marked as safe.`);

        if (req.io) {
            req.io.emit('sos_resolved', {
                id: alert.id
            });
        }

        // Log Activity
        try {
            const activity = new Activity({
                type: 'sos_resolved',
                message: `SOS Alert resolved: ${alert.id}`,
                metadata: { alertId: alert.id }
            });
            await activity.save();
        } catch (actErr) {
            console.error('Activity Logging Error:', actErr.message);
        }

        res.json(alert);
    } catch (err) {
        console.error('SOS Resolve Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/sos/my-alerts
// @desc    Get user's SOS history
// @access  Private
router.get('/my-alerts', auth, async (req, res) => {
    try {
        const alerts = await SOS.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(alerts);
    } catch (err) {
        console.error('SOS Fetch Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
