const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Place = require('../models/Place');

// Test route to verify API is working
router.get('/test', (req, res) => {
    res.json({ msg: 'Reviews API is working!', timestamp: new Date() });
});


// @route   POST /api/reviews
// @desc    Submit a review for a place
// @access  Public (should be protected in production)
router.post('/', async (req, res) => {
    const { userId, placeId, userName, rating, comment } = req.body;

    try {
        // Validate input
        if (!userId || !placeId || !userName || !rating || !comment) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
        }

        console.log('Creating review with data:', { userId, placeId, userName, rating, comment });

        // Create new review
        const review = new Review({
            userId,
            placeId,
            userName,
            rating,
            comment
        });

        await review.save();
        console.log('Review saved successfully:', review._id);

        // Update place's average rating and review count
        await updatePlaceRating(placeId);

        res.json({ msg: 'Review submitted successfully', review });

    } catch (err) {
        console.error('Error in POST /api/reviews:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   GET /api/reviews/:placeId
// @desc    Get all reviews for a specific place
// @access  Public
router.get('/:placeId', async (req, res) => {
    try {
        console.log('Fetching reviews for placeId:', req.params.placeId);
        const reviews = await Review.find({ placeId: req.params.placeId })
            .sort({ createdAt: -1 }); // Most recent first

        console.log(`Found ${reviews.length} reviews`);
        res.json(reviews);

    } catch (err) {
        console.error('Error in GET /api/reviews/:placeId:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Public (should verify userId in production)
router.put('/:id', async (req, res) => {
    const { rating, comment } = req.body;

    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
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
// @access  Public (should verify userId in production)
router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
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

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        review.helpfulCount += 1;
        await review.save();

        res.json({ msg: 'Review marked as helpful', helpfulCount: review.helpfulCount });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Helper function to update place rating
async function updatePlaceRating(placeId) {
    try {
        console.log('Updating place rating for placeId:', placeId);
        const reviews = await Review.find({ placeId });
        console.log(`Found ${reviews.length} reviews for rating calculation`);

        if (reviews.length === 0) {
            console.log('No reviews found, skipping place update');
            // Try to update if it's a valid ObjectId, otherwise skip
            try {
                await Place.findByIdAndUpdate(placeId, {
                    averageRating: 0,
                    reviewCount: 0
                });
            } catch (err) {
                console.log('Could not update place (might not be ObjectId):', err.message);
            }
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        console.log(`Calculated average rating: ${averageRating} from ${reviews.length} reviews`);

        // Try to update if it's a valid ObjectId, otherwise skip
        try {
            await Place.findByIdAndUpdate(placeId, {
                averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                reviewCount: reviews.length
            });
            console.log('Place rating updated successfully');
        } catch (err) {
            console.log('Could not update place (might not be ObjectId):', err.message);
        }

    } catch (err) {
        console.error('Error updating place rating:', err.message);
    }
}

module.exports = router;
