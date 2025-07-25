const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  updateAdminPassword,
  createDefaultAdmin,
   getPendingSellers,
  approveSeller,
  getAdminDashboardStats,
  getAllSellers,
   deleteSeller,
   getAllRestaurants,
   deleteRestaurant,
   getAllUsers
} = require("../controllers/adminController");
const verifyAdmin = require("../Middleware/verifyAdmin");

 
router.get("/setup", createDefaultAdmin);
router.post("/login", loginAdmin);
router.put("/update", updateAdminPassword);

router.get("/dashboard/stats", verifyAdmin, getAdminDashboardStats);

router.get("/sellers",verifyAdmin, getAllSellers);
router.get("/sellers/pending",verifyAdmin, getPendingSellers);
router.put("/sellers/:id/approve",verifyAdmin, approveSeller);
router.delete("/seller/:id",verifyAdmin, deleteSeller);

router.get("/restaurants", verifyAdmin, getAllRestaurants);
router.delete("/restaurant/:id", verifyAdmin,deleteRestaurant);

router.get("/users", verifyAdmin, getAllUsers);

module.exports = router;
