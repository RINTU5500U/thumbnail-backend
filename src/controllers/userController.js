const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { sendOtpToPhone, sendSms } = require('../utils/smsService'); // Assuming you have a utility to send SMS

async function sendOtp(req, res) {
    try {
        const { phone, type } = req.body;

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        // await sendOtpToPhone(phone, otp);
        // const expiry = new Date(Date.now() + 5 * 60 * 1000);

        if (type == 'register') {
            const existingUser = await userModel.find({ phone });
            if (existingUser) {
                return res.status(409).json({ success: false, message: 'User already exists with this phone number' });
            }
            await userModel.create({ phone, otp })
        } else {
            await userModel.findOneAndUpdate({ otp }, { phone }, { new: true });
        }

        console.log(`OTP for ${type}:`, otp); // Replace with SMS provider
        return res.status(200).json({ success: true, otp, message: 'OTP sent successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function verifyOtp(req, res) {
    try {
        const { phone, otp, type } = req.body;
        const user = await userModel.findOne({ phone, otp });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid OTP' });
        }

        let token;
        if (type !== 'register') {
            token = jwt.sign({ id: user._id, email: user.email, phone: user.phone }, process.env.JWT_SECRET);
        }

        return res.status(200).json({ success: true, message: 'OTP verified successfully', token, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function register(req, res) {
    try {
        const { phone, fullName, email, password, interests } = req.body;

        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User is already exist with the email' });
        }

        const user = await userModel.findOneAndUpdate(
            { phone },
            { fullName, email, password, interests },
            { new: true }
        );

        return res.status(200).json({ success: true, message: 'User registered successfully', user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function login(req, res) {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Email/Phone and password are required' });
        }

        const query = identifier.includes('@') ? { email: identifier } : { phone: identifier };
        const user = await userModel.findOne(query);
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, phone: user.phone }, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, message: 'Logged in successfully', token, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function resetPassword(req, res) {
    try {
        const { phone, email } = req.user;
        const { password } = req.body;

        const user = await userModel.findOne({ $or: [{ email }, { phone }] });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await userModel.findByIdAndUpdate(user._id, { password: password });
        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function updateProfile(req, res) {
    try {
        const { userId } = req.params;

        const updatedUser = await userModel.findByIdAndUpdate( userId, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    sendOtp,
    verifyOtp,
    register,
    login,
    resetPassword,
    updateProfile,
};

