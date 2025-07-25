const userData = require("../models/UserModel");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/SendEmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const reverseGeocode = require('../utils/reverseGeocode')

// OTP generation
const generateotp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Expiration time => 10 min
const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

// Registration
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneno} = req.body;
    const usernameExists = await userData.findOne({ username });
    if (usernameExists) return res.status(400).json({ message: "Username already exists" });
    const emailExists = await userData.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const verificationEmail = generateotp();
    await userData.create({
      username,
      email,
      password: hashedPassword,
      phoneno,
      verificationEmail,
    });
    await sendVerificationEmail(email, username, verificationEmail, expiresAt);
    res.status(200).json({ message: "Signup successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error during registration" });
  }
};

// Verification key
const verifyUser = async (req, res) => {
  try {
    const { verificationEmail } = req.body;
    const user = await userData.findOne({ verificationEmail });
    if (!user) return res.status(400).json({ message: "Invalid or expired otp" });
    user.isVerified = true;
    user.verificationEmail = null;
    await user.save();
    res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Error during verification" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userData.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your account before logging in" });
    }
    const payload = {
      userId: user._id,
      username:user.username,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error during login" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const passwordotp = generateotp();
    user.resetpasswordotp = passwordotp;
    await user.save()
    await sendPasswordResetEmail(email, passwordotp, expiresAt);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot Password error:", err);
    res.status(500).json({ message: "Error sending OTP to email" });
  }
};

// Verify Reset OTP
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userData.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.resetpasswordotp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await userData.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedNewPassword;
    user.resetpasswordotp = null;
    await user.save();
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// userlocation update
const updateUserLocation = async (req, res) => {
  const { lat, lon } = req.body;
  const userId = req.user.userId;
  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and Longitude are required." });
  }
  const locationData = await reverseGeocode(lat, lon);
  if (!locationData) {
    return res.status(500).json({ message: "Reverse geocoding failed." });
  }
  const { address, city } = locationData;
  const updated = await userData.findByIdAndUpdate(
    userId,
    {
      location: {
        address,
        city: city?.toLowerCase() || "",
        pincode: "", 
      },
    },
    { new: true }
  );
  res.json({
    message: "Location updated",
    location: updated.location,
  });
};

// user info
const usersInfo = async (req,res)=>{
 try {
  const user = await userData.findById(req.user.userId).select('-password'); 
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET /me error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  updateUserLocation,
  usersInfo
};