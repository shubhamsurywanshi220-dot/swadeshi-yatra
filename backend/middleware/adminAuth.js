const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admin role required.' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Admin middleware error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = adminAuth;
