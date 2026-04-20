const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminAuth = require('../middleware/adminAuth');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'destinations');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate clean filename: destination_timestamp_index.ext
        const cleanName = (req.body.destName || 'destination')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 30);
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1000);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
    }
});

// File filter - only allow JPG, PNG, WEBP
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only JPG, PNG, and WEBP are allowed.`), false);
    }
};

// Multer instance - max 5MB per file
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 10 // Max 10 files at once
    }
});

// @route   POST /api/upload/image
// @desc    Upload a single image
// @access  Admin
router.post('/image', adminAuth, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
                }
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        // Build the accessible URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/destinations/${req.file.filename}`;

        console.log(`📸 [UPLOAD] Image uploaded: ${req.file.filename} (${(req.file.size / 1024).toFixed(1)}KB)`);

        res.json({
            success: true,
            url: imageUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    });
});

// @route   POST /api/upload/images
// @desc    Upload multiple images (up to 10)
// @access  Admin
router.post('/images', adminAuth, (req, res) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'One or more files are too large. Maximum size is 5MB per file.' });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({ error: 'Too many files. Maximum is 10 files at once.' });
                }
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const uploaded = req.files.map(file => ({
            url: `${baseUrl}/uploads/destinations/${file.filename}`,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype
        }));

        console.log(`📸 [UPLOAD] ${uploaded.length} images uploaded successfully.`);

        res.json({
            success: true,
            count: uploaded.length,
            images: uploaded
        });
    });
});

// @route   DELETE /api/upload/image/:filename
// @desc    Delete an uploaded image
// @access  Admin
router.delete('/image/:filename', adminAuth, (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found.' });
    }

    try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ [UPLOAD] Image deleted: ${req.params.filename}`);
        res.json({ success: true, message: 'Image deleted successfully.' });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).json({ error: 'Failed to delete file.' });
    }
});

module.exports = router;
