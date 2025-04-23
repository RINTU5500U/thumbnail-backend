const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function authentication(req, res, next) {
    try {
        const token = req.headers.authorization//?.split(' ')[1]; // Bearer <token>
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid User' })
        }

        req.user = user; // Inject user into request
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

async function authorization(req, res, next) {
    if (!req.user) {
        return res.status(403).json({ success: false, message: 'Unauthorized User' })
    }
    if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized User' })
    }
    next();
};


module.exports = { authentication, authorization };
