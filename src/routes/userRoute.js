const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, register, login, resetPassword, updateProfile } = require('../controllers/userController');
const { authentication, authorization } = require('../middlewares/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', authentication, resetPassword);
router.put('/update-profile/:userId', authentication, authorization, updateProfile);

module.exports = router;
