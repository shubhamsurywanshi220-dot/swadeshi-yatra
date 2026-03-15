const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

// @route   GET /api/tickets
// @desc    Get all tickets for the logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.user.id }).sort({ visitDate: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/tickets
// @desc    Create a new ticket booking
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { placeId, placeName, visitDate, numberOfTickets, totalAmount, passengerName, contactEmail } = req.body;

        // Simple Booking ID generation
        const bookingId = 'SWY-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const newTicket = new Ticket({
            userId: req.user.id,
            placeId,
            placeName,
            visitDate,
            numberOfTickets,
            totalAmount,
            bookingId,
            passengerName,
            contactEmail
        });

        const ticket = await newTicket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/tickets/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

        if (ticket.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Booking cancelled' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
