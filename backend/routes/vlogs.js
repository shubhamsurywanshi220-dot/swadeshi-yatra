const express = require('express');
const router = express.Router();
const Vlog = require('../models/Vlog');
const auth = require('../middleware/auth');

// ──────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ──────────────────────────────────────────────────────────────

// @route   GET /api/vlogs
// @desc    Get all APPROVED vlogs with optional filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { location, category, destination_id, limit = 20, page = 1 } = req.query;
        const filter = { status: 'approved' };

        if (location) filter.location = { $regex: location, $options: 'i' };
        if (destination_id) filter.destination_id = destination_id;
        if (category && category !== 'All') {
            if (category === 'Trending') {
                filter.views = { $gte: 50000 };
            } else {
                filter.category = category;
            }
        }

        const vlogs = await Vlog.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json(vlogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/vlogs/place/:destinationId
// @desc    Get approved vlogs linked to a specific destination
// @access  Public
router.get('/place/:destinationId', async (req, res) => {
    try {
        const vlogs = await Vlog.find({ destination_id: req.params.destinationId, status: 'approved' })
            .sort({ views: -1 })
            .limit(10);
        res.json(vlogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/vlogs/:id/view
// @desc    Increment view count
// @access  Public
router.post('/:id/view', async (req, res) => {
    try {
        await Vlog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ msg: 'View recorded' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ──────────────────────────────────────────────────────────────
// USER AUTHENTICATED ROUTES
// ──────────────────────────────────────────────────────────────

// @route   POST /api/vlogs
// @desc    Submit a new vlog (status = pending)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, video_url, thumbnail, location, destination_id, description, category, duration } = req.body;

        if (!title || !location) {
            return res.status(400).json({ msg: 'Title and location are required.' });
        }

        // Prevent exact duplicate uploads by same user
        const existing = await Vlog.findOne({ title, user: req.user?.name, location });
        if (existing) {
            return res.status(400).json({ msg: 'You have already uploaded a vlog with this title and location.' });
        }

        const vlog = new Vlog({
            title,
            video_url: video_url || null,
            thumbnail: thumbnail || null,
            location,
            destination_id: destination_id || null,
            user: req.user?.name || 'Anonymous',
            userId: req.user?.id || null,
            description: description || '',
            category: category || 'General',
            duration: duration || null,
            status: 'pending', // Requires admin approval
        });

        await vlog.save();

        // Notify admin via Socket.io
        if (req.io) {
            req.io.emit('vlog:new_pending', { id: vlog._id, title: vlog.title, user: vlog.user });
        }

        res.json({ msg: 'Vlog submitted! It will appear after admin review.', vlog });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/vlogs/:id/like
// @desc    Toggle like on a vlog
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
    try {
        const vlog = await Vlog.findById(req.params.id);
        if (!vlog) return res.status(404).json({ msg: 'Vlog not found' });

        const userId = req.user.id;
        const alreadyLiked = vlog.likedBy.map(String).includes(String(userId));

        if (alreadyLiked) {
            vlog.likedBy.pull(userId);
            vlog.likes = Math.max(0, vlog.likes - 1);
        } else {
            vlog.likedBy.push(userId);
            vlog.likes += 1;
        }

        await vlog.save();
        res.json({ liked: !alreadyLiked, likes: vlog.likes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/vlogs/:id/save
// @desc    Toggle save on a vlog
// @access  Private
router.post('/:id/save', auth, async (req, res) => {
    try {
        const vlog = await Vlog.findById(req.params.id);
        if (!vlog) return res.status(404).json({ msg: 'Vlog not found' });

        const userId = req.user.id;
        const isSaved = vlog.savedBy.map(String).includes(String(userId));

        if (isSaved) {
            vlog.savedBy.pull(userId);
        } else {
            vlog.savedBy.push(userId);
        }

        await vlog.save();
        res.json({ saved: !isSaved });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ──────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ──────────────────────────────────────────────────────────────

// @route   GET /api/vlogs/admin/all
// @desc    Get ALL vlogs (pending + approved + rejected) for moderation
// @access  Admin
router.get('/admin/all', async (req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const filter = status ? { status } : {};
        const vlogs = await Vlog.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Vlog.countDocuments(filter);
        res.json({ vlogs, total });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/vlogs/admin/:id/status
// @desc    Approve or reject a vlog
// @access  Admin
router.patch('/admin/:id/status', async (req, res) => {
    try {
        const { status, flaggedReason } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status. Must be approved, rejected, or pending.' });
        }

        const update = { status };
        if (flaggedReason) update.flaggedReason = flaggedReason;

        const vlog = await Vlog.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!vlog) return res.status(404).json({ msg: 'Vlog not found' });

        // Real-time push to mobile clients via Socket.io
        if (req.io) {
            req.io.emit('vlog:status_changed', { id: vlog._id, status: vlog.status });
        }

        res.json({ msg: `Vlog ${status} successfully.`, vlog });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/vlogs/admin/:id
// @desc    Permanently delete a vlog
// @access  Admin
router.delete('/admin/:id', async (req, res) => {
    try {
        const vlog = await Vlog.findByIdAndDelete(req.params.id);
        if (!vlog) return res.status(404).json({ msg: 'Vlog not found' });

        if (req.io) {
            req.io.emit('vlog:deleted', { id: req.params.id });
        }

        res.json({ msg: 'Vlog deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
