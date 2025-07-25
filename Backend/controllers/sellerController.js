const Seller = require("../models/SellerModel");
const Restaurant = require("../models/RestaurantModel");
const Order = require("../models/orderModel");
const Food = require("../models/FoodModel");
const bcrypt = require("bcrypt");
const reverseGeocode = require("../utils/reverseGeocode");
const jwt = require("jsonwebtoken");
const {sendDeliverySuccessEmail} = require("../utils/SendEmail.js");
const User = require("../models/UserModel")

// seller signup
const sellerSignup = async (req, res) => {
  const {
    restaurantName,
    image,
    description,
    rating,
    latitude,
    longitude,
    sellerName,
    phone,
    email,
    password,
  } = req.body;

  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already registered with this email." });
    }
    // Reverse geocode
    const geo = await reverseGeocode(latitude, longitude);
    if (!geo) return res.status(400).json({ message: "Invalid coordinates" });
    const restaurant = new Restaurant({
      name: restaurantName,
      address: geo.address,
      city: geo.city,
      image,
      description,
      rating,
      latitude,
      longitude,
    });
    const savedRestaurant = await restaurant.save();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({
      restaurant: savedRestaurant._id,
      sellerName,
      phone,
      email,
      password: hashedPassword,
      isApproved: false,
    });
    await newSeller.save();
    res.status(201).json({ message: "Seller signup successful. Awaiting admin approval." });
  } catch (error) {
    console.error("Seller signup error:", error);
    res.status(500).json({ message: "Something went wrong during signup." });
  }
};

// seller login
const sellerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email }).populate("restaurant");
    if (!seller) {
      return res.status(400).json({ message: "Seller not found" });
    }
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (!seller.isApproved) {
      return res.status(403).json({ message: "Your account is waiting for admin approval." });
    }
    const token = jwt.sign({ sellerId: seller._id, role: "seller" }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Seller login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get all foods 
const getSellerFoods = async (req, res) => {
  try {
    const sellerId = req.seller?.sellerId;
    if (!sellerId) return res.status(401).json({ message: "Unauthorized" });
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    const foods = await Food.find({ restaurant: seller.restaurant }).populate("category");
    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching seller foods:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new food
const addFood = async (req, res) => {
  try {
    const sellerId = req.seller?.sellerId;
    const { name, price, type, category, image, description, quantity } = req.body;
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    const newFood = new Food({
      name,
      price,
      type,
      image,
      description,
      quantity,
      category,
      restaurant: seller.restaurant,
    });
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete food
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Delete food error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// update food 
const updateFoodById = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.status(200).json({ message: "Food updated", food });
  } catch (err) {
    console.error("Update food error:", err);
    res.status(500).json({ message: "Failed to update" });
  }
};

// get orders where at least one food item belongs to this seller's restaurant
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller?.sellerId;
    if (!sellerId) return res.status(401).json({ message: "Unauthorized" });
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    const restaurantId = seller.restaurant;
    const sellerFoodIds = await Food.find({ restaurant: restaurantId }).distinct("_id");
    const orders = await Order.find({
      "cartItems.foodId": { $in: sellerFoodIds },
    })
      .populate("userId", "username email")
      .populate({
        path: "cartItems.foodId",
        populate: { path: "restaurant", select: "name" },
      })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get a single food by ID
const getFoodById = async (req, res) => {
  try {
    const sellerId = req.seller?.sellerId;
    const foodId = req.params.id;
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    const food = await Food.findOne({ _id: foodId, restaurant: seller.restaurant }).populate("category");
    if (!food) return res.status(404).json({ message: "Food item not found or unauthorized" });
    res.status(200).json(food);
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).json({ message: "Failed to fetch food item" });
  }
};

//update status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
const user = await User.findById(order.userId);
    order.orderStatus = status;
    await order.save();
     // Send delivery email if status is "Delivered"
    if (status === "Delivered") {
      await sendDeliverySuccessEmail(user.email, user.username, order.orderId);
    }
    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Failed to update order" });
  }
};

// seller dashboard
const getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.seller.sellerId;
    const seller = await Seller.findById(sellerId);
    const restaurantId = seller.restaurant;
    const allFoods = await Food.find({ restaurant: restaurantId });
    const totalFoodItems = allFoods.length;
    const outOfStock = allFoods.filter(item => item.quantity === 0).length;
    const foodIds = allFoods.map(item => item._id);
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const weeklyOrders = await Order.find({
      createdAt: { $gte: weekAgo },
      "cartItems.foodId": { $in: foodIds },
    });
    const deliveredOrders = weeklyOrders.filter(o => o.orderStatus === "Delivered");
    const totalRevenue = weeklyOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      "cartItems.foodId": { $in: foodIds },
    });
    res.json({
      totalWeeklyOrders: weeklyOrders.length,
      totalDelivered: deliveredOrders.length,
      totalRevenue,
      todayOrders: todayOrders.length,
      totalFoodItems,
      outOfStock
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// sellerprofile
const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.seller.sellerId;
    const seller = await Seller.findById(sellerId).populate("restaurant");
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.status(200).json({
      sellerName: seller.sellerName,
      phone: seller.phone,
      email: seller.email,
      restaurantName: seller.restaurant.name,
      description: seller.restaurant.description,
      image:seller.restaurant.image
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// update seller profile
const updateSellerProfile = async (req, res) => {
  try {
    const sellerId = req.seller.sellerId;
    const { sellerName, phone, restaurantName, description, image } = req.body;
    const seller = await Seller.findById(sellerId).populate("restaurant");
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    seller.sellerName = sellerName;
    seller.phone = phone;
    seller.restaurant.name = restaurantName;
    seller.restaurant.description = description;
    seller.restaurant.image = image;
    await seller.save();
    await seller.restaurant.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = {sellerSignup,sellerLogin, getSellerFoods, addFood,getFoodById,deleteFood,updateFoodById,getSellerOrders,
  updateOrderStatus,getSellerDashboardStats,getSellerProfile,updateSellerProfile}