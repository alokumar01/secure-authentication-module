const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mfaSecret: { type: String }, // Secret for Speakeasy MFA (TOTP)
    emailOtp: { type: String }, // Store OTP for email verification
    otpExpires: { type: Date } // Expiry time for OTP
});

module.exports = mongoose.model("User", UserSchema);
