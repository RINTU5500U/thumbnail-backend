const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true},
    fullName: String,
    password: String,
    interests: [String],
    otp: String,
    // otpExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
