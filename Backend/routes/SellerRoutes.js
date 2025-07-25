const express = require("express");
const { sellerSignup, sellerLogin ,getSellerFoods,getFoodById, addFood, deleteFood ,updateFoodById, getSellerOrders,
  updateOrderStatus,getSellerDashboardStats,getSellerProfile,updateSellerProfile} = require("../controllers/sellerController");
const verifySeller = require("../Middleware/verifySeller")
const router = express.Router();

router.post("/signup", sellerSignup);
router.post("/login", sellerLogin)

router.get("/foods", verifySeller, getSellerFoods);
router.get("/foods/:id", verifySeller, getFoodById);
router.post("/foods", verifySeller, addFood);
router.delete("/foods/:id", verifySeller, deleteFood)
router.put("/foods/:id", verifySeller, updateFoodById);

router.get("/orders", verifySeller, getSellerOrders);
router.put("/orders/:id/status", verifySeller, updateOrderStatus);

router.get("/dashboard/stats", verifySeller, getSellerDashboardStats);

router.get("/profile", verifySeller, getSellerProfile);
router.put("/profile", verifySeller, updateSellerProfile);

module.exports = router;
