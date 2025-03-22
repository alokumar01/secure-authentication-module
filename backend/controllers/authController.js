const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

let otpStore = {}; // Temporary storage for OTPs (Use Redis for production)

// Email Transporter (Use your SMTP credentials)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email app password
    }
});

// **REGISTER USER**
// exports.registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({ username, email, password: hashedPassword });
//         await user.save();

//         res.status(201).json({ message: "User registered successfully!" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// code from grok
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password.slice(0, 20), 10);
        const secretObj = speakeasy.generateSecret({ length: 20 }); // 20 bytes = 32 chars in base32
        const mfaSecret = secretObj.base32;

        const user = new User({ username, email, password: hashedPassword, mfaSecret });
        await user.save();

        res.status(201).json({ message: "User registered successfully!", mfaSecret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// **LOGIN USER & SEND EMAIL OTP**
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        // Generate a 6-digit OTP
        const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[username] = { otp: emailOTP, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 mins

        // Send OTP via Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Secure Authentication OTP",
            text: `Your OTP for authentication is: ${emailOTP}. This OTP will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Login successful, verify OTP via email." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// **VERIFY EMAIL OTP & ISSUE ACCESS TOKEN**
exports.verifyEmailOTP = async (req, res) => {
    try {
        const { username, otp } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: "User not found!" });

        // Validate OTP
        const storedOTP = otpStore[username];
        if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP!" });
        }

        delete otpStore[username]; // Remove OTP after successful verification

        // Generate JWT Token
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "OTP verified, access granted!", accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// **VERIFY MFA TOTP (Time-Based One-Time Password)**
exports.verifyMFA = async (req, res) => {
    try {
        const { username, token } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: "User not found!" });

        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: "base32",
            token
        });

        if (!verified) return res.status(400).json({ message: "Invalid MFA Code!" });

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "MFA verified, access granted!", accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
