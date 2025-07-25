const bcrypt = require("bcrypt");
const Admin = require("../models/AdminModel");
const Seller = require("../models/SellerModel");
const jwt = require("jsonwebtoken");
const Order = require("../models/orderModel");
const Restaurant = require("../models/RestaurantModel");
const User = require("../models/UserModel");

// One-time admin setup
const createDefaultAdmin = async (req, res) => {
  try {
    const exists = await Admin.findOne();
    if (exists) return res.status(400).json({ message: "Admin already exists" });
    const hashedPassword = await bcrypt.hash("admin@123", 10);
    const newAdmin = new Admin({
      email: "admin@gmail.com".toLowerCase(),
      password: hashedPassword,
      isFirstLogin: true,
    });
    await newAdmin.save();
    res.status(200).json({ message: "Default admin created" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
};

//  Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

     const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET, 
    );
    res.status(200).json({
      message: "Login successful",
      isFirstLogin: admin.isFirstLogin,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  First-time update only when isFirstLOgin is True 
const updateAdminPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (!admin.isFirstLogin) {
      return res.status(400).json({ message: "Unauthorized update attempt" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    admin.isFirstLogin = false;
    await admin.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
};

// this shows the adminDashboard
const getAdminDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "Delivered" });
    const sellers = await Seller.find();
    const users = await User.find();
    const restaurants = await Restaurant.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const adminCommission = totalRevenue * 0.1  // 10% commission
    res.json({
      totalSellers: sellers.length,
      totalUsers: users.length,
      totalRestaurants: restaurants.length,
      totalOrders: orders.length,
      totalRevenue,
      adminCommission,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

// This shows the seller details
const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().populate("restaurant");
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
};

// Get all sellers waiting for approval to login
const getPendingSellers = async (req, res) => {
  try {
    const pendingSellers = await Seller.find({ isApproved: false }).populate("restaurant");
    res.status(200).json(pendingSellers);
  } catch (error) {
    console.error("Error fetching pending sellers:", error);
    res.status(500).json({ message: "Failed to get pending sellers" });
  }
};

// Approve a seller
const approveSeller = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;
  try {
    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    seller.isApproved = isApproved;
    await seller.save();
    res.json({ message: `Seller ${isApproved ? "approved" : "rejected"}` });
  } catch (err) {
    res.status(500).json({ message: "Error updating seller approval" });
  }
};

//  delete the seller
const deleteSeller = async (req, res) => {
  const { id } = req.params;
  try {
    await Seller.findByIdAndDelete(id);
    res.json({ message: "Seller deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete seller" });
  }
};

// get all res details
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

// delete the res
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Delete error", error);
    res.status(500).json({ message: "Error deleting restaurant" });
  }
};

// get all user details
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports ={loginAdmin,updateAdminPassword,createDefaultAdmin,getAdminDashboardStats,getAllSellers, 
  getPendingSellers,approveSeller,deleteSeller, getAllRestaurants,
  deleteRestaurant,getAllUsers}