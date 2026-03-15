const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Place = require('../models/Place');
const auth = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Submit a review for a place
// @access  Private
router.post('/', auth, async (req, res) => {
    const { placeId, userName, rating, comment, category, city } = req.body;

    try {
        // Validate input
        if (!placeId || !rating || !comment) {
            return res.status(400).json({ msg: 'Required fields missing' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
        }

        // Create new review
        const review = new Review({
            userId: req.user.id,
            placeId,
            userName: userName || 'Anonymous Traveler', // Ideally fetch from User model
            rating,
            comment,
            category,
            city
        });

        await review.save();

        // Update place's average rating and review count
        await updatePlaceRating(placeId);

        res.json({ msg: 'Review submitted successfully', review });

    } catch (err) {
        console.error('Error in POST /api/reviews:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/reviews/:placeId
// @desc    Get all reviews for a specific place
// @access  Public
router.get('/:placeId', async (req, res) => {
    try {
        const reviews = await Review.find({ placeId: req.params.placeId })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error('Error in GET /api/reviews/:placeId:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { rating, comment } = req.body;

    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Ensure user owns the review
        if (review.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        review.updatedAt = Date.now();

        await review.save();

        // Update place's average rating
        await updatePlaceRating(review.placeId);

        res.json({ msg: 'Review updated successfully', review });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Ensure user owns the review
        if (review.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const placeId = review.placeId;
        await Review.findByIdAndDelete(req.params.id);

        // Update place's average rating
        await updatePlaceRating(placeId);

        res.json({ msg: 'Review deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark a review as helpful
// @access  Public
router.post('/:id/helpful', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ msg: 'Review not found' });

        review.helpfulCount += 1;
        await review.save();
        res.json({ msg: 'Review marked as helpful', helpfulCount: review.helpfulCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reviews/user/:userId/count
// @desc    Get total count of reviews for a user
// @access  Public
router.get('/user/:userId/count', async (req, res) => {
    try {
        const count = await Review.countDocuments({ userId: req.params.userId });
        res.json({ count });
    } catch (err) {
        console.error('Error fetching review count:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Helper function to update place rating (internal use)
async function updatePlaceRating(placeId) {
    try {
        const reviews = await Review.find({ placeId });
        if (reviews.length === 0) {
            await Place.findByIdAndUpdate(placeId, { averageRating: 0, reviewCount: 0 });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Place.findByIdAndUpdate(placeId, {
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: reviews.length
        });
    } catch (err) {
        console.error('Error updating place rating:', err.message);
    }
}

module.exports = router;
