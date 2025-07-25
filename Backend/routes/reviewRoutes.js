const express = require("express");
const router = express.Router();
const {
  addFoodReview,
  addRestaurantReview,
  submitReview
} = require("../controllers/reviewController");
const verifyToken= require("../Middleware/authmidddleware");

router.post("/food/:orderId/:foodId", verifyToken, addFoodReview);
router.post("/restaurant/:orderId", verifyToken, addRestaurantReview);
router.post("/submit",verifyToken, submitReview)
module.exports = router;
