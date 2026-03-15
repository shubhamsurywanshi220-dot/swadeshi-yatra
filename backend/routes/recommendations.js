const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Business = require('../models/Business');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// @route   GET /api/recommendations
// @desc    Get personalized recommendations for the user
// @access  Private
// @route   GET /api/recommendations
// @desc    Get personalized recommendations for the user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch user reviews to understand preferences
        const userReviews = await Review.find({ userId });

        // 2. Extract preferred categories and cities
        const preferredCategories = [...new Set(userReviews.map(r => r.category).filter(Boolean))];
        const preferredCities = [...new Set(userReviews.map(r => r.city).filter(Boolean))];

        // Helper to check for images
        const hasImage = (item) => !!(item.imageUrl || (item.images && item.images.length > 0) || (item.detailedInfo?.additionalImages?.length > 0));

        // 3. Build Recommendation Engine Logic
        let recommendedPlaces = [];
        let recommendedBusinesses = [];

        if (preferredCategories.length > 0 || preferredCities.length > 0) {
            // Personalized: Same category/city but not already reviewed
            recommendedPlaces = await Place.find({
                $or: [
                    { category: { $in: preferredCategories } },
                    { city: { $in: preferredCities } }
                ],
                _id: { $nin: userReviews.map(r => r.placeId).filter(id => id.length === 24) }
            }).sort({ rating: -1 });

            recommendedBusinesses = await Business.find({
                isVerified: true,
                $or: [
                    { category: { $in: preferredCategories } },
                    { city: { $in: preferredCities } }
                ]
            }).sort({ averageRating: -1 });
        }

        // 4. Fill with trending if personalized results are too few
        if (recommendedPlaces.length < 10) {
            const trendingPlaces = await Place.find({
                _id: { $nin: recommendedPlaces.map(p => p._id) }
            }).limit(20).sort({ rating: -1 });
            recommendedPlaces = [...recommendedPlaces, ...trendingPlaces];
        }

        if (recommendedBusinesses.length < 5) {
            const trendingBusinesses = await Business.find({
                isVerified: true,
                _id: { $nin: recommendedBusinesses.map(b => b._id) }
            }).limit(10).sort({ averageRating: -1 });
            recommendedBusinesses = [...recommendedBusinesses, ...trendingBusinesses];
        }

        // 5. Final Sort by Image Presence
        const finalPlaces = [...recommendedPlaces].sort((a, b) => {
            const aImg = hasImage(a);
            const bImg = hasImage(b);
            if (aImg && !bImg) return -1;
            if (!aImg && bImg) return 1;
            return 0;
        });

        const finalBusinesses = [...recommendedBusinesses].sort((a, b) => {
            const aImg = hasImage(a);
            const bImg = hasImage(b);
            if (aImg && !bImg) return -1;
            if (!aImg && bImg) return 1;
            return 0;
        });

        res.json({
            places: finalPlaces.slice(0, 10),
            businesses: finalBusinesses.slice(0, 5),
            type: (preferredCategories.length > 0) ? 'personalized' : 'trending'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
