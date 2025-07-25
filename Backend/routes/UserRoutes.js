const express = require('express');
const router = express.Router();
const { registerUser,verifyUser,loginUser,forgotPassword,verifyResetOtp,resetPassword,updateUserLocation,usersInfo} = require('../controllers/userController');
const verifyToken = require("../Middleware/authmidddleware")


router.post('/register', registerUser);
router.post('/verify', verifyUser)
router.post('/login', loginUser)
router.post("/forgot-password",forgotPassword)  // to enter email and sent otp
router.post("/verify-reset-otp", verifyResetOtp) //to enter otp that send to email
router.post("/reset-password", resetPassword); //to change password to new password
router.put("/update-location", verifyToken, updateUserLocation)
router.get("/user-info",verifyToken,usersInfo)

module.exports = router;
