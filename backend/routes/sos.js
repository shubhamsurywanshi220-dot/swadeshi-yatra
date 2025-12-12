const express = require('express');
const router = express.Router();

// @route   POST /api/sos/alert
// @desc    Send SOS alert with location
// @access  Public
router.post('/alert', async (req, res) => {
    try {
        const { latitude, longitude, userId } = req.body;

        // In a real app, this would trigger SMS/Push Notification via Twilio/FCM
        // For now, we simulate the logic.

        console.log(`🚨 SOS ALERT RECEIVED!`);
        console.log(`User ID: ${userId || 'Anonymous'}`);
        console.log(`Location: ${latitude}, ${longitude}`);
        console.log(`https://www.google.com/maps?q=${latitude},${longitude}`);

        // Mock database save logic
        // const newAlert = new SOSAlert({ user: userId, location: { lat, lng } });
        // await newAlert.save();

        res.status(200).json({
            success: true,
            message: 'SOS Alert Sent Successfully',
            info: 'Emergency services notified with your current location.'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
