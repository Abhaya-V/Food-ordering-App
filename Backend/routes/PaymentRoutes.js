const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/authmidddleware")

const {createPaymentOrder,getRazorpayKey,verifyPayment} = require("../controllers/PaymentController")

router.post("/create-order", verifyToken, createPaymentOrder)
router.get("/get-key", verifyToken, getRazorpayKey)
router.post("/verify", verifyToken, verifyPayment)

module.exports = router
