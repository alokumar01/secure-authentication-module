const express = require('express');
const { registerUser, loginUser, verifyMFA, verifyEmailOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-mfa', verifyMFA);
router.post('/verify-email-otp', verifyEmailOTP); // Ensure this function exists in authController.js

module.exports = router;
