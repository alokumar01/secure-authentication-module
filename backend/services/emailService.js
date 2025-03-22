const nodemailer = require("nodemailer");
dotenv.config({ path: '../.env' });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmailOtp = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Secure Authentication OTP",
            text: `Your OTP for authentication is: ${otp}. It will expire in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ OTP sent to:", email);
    } catch (err) {
        console.error("❌ Error sending email:", err);
    }
};

module.exports = sendEmailOtp;
