const Food = require("../models/FoodModel");
const Order = require("../models/orderModel");
const Restaurant = require("../models/RestaurantModel");
const Review = require("../models/ReviewModel")
const User = require("../models/UserModel");

// Review a food item
const addFoodReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { orderId, foodId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const item = order.items.find(
      (i) => i.foodId.toString() === foodId
    );
    if (!item || item.reviewed) {
      return res.status(400).json({ message: "Already reviewed or invalid item" });
    }
    const food = await Food.findById(foodId);
    food.reviews.push({
      user:req.user.userId,
      name: req.user.username,
      rating,
      comment,
    });
    await food.save();
    item.reviewed = true;
    await order.save();
    res.status(200).json({ message: "Food review added" });
  } catch (err) {
    console.error("Food review error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Review a restaurant
const addRestaurantReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("restaurant");
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (order.restaurantReviewed) {
      return res.status(400).json({ message: "Restaurant already reviewed" });
    }
    order.restaurant.reviews.push({
      user: req.user.userid,
      rating,
      comment,
    });
    order.restaurantReviewed = true;
    await order.restaurant.save();
    await order.save();
    res.status(200).json({ message: "Restaurant review added" });
  } catch (err) {
    console.error("Restaurant review error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

//  submit the review 
const submitReview = async (req, res) => {
  try {
    const { orderId, foodId, type, rating, comment, restaurantId } = req.body;
    const userId = req.user.userId;
    const userName = req.user.username || "Anonymous";
    let reviewData = {
      user: userId,
      name: userName,
      rating,
      comment,
    };
    if (type === "food") {
      const food = await Food.findById(foodId);
      if (!food) return res.status(404).json({ message: "Food not found" });
      // Push to food reviews
      food.reviews.push(reviewData);
      await food.save();
      // Update order item
      const order = await Order.findById(orderId);
      const item = order.cartItems.find(i => i.foodId.toString() === foodId);
      if (item) {
        item.reviewed = true;
        await order.save();
      }
      // Save to review DB
      await Review.create({ ...reviewData, food: foodId });
    } else if (type === "restaurant") {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      // Push to restaurant reviews
      restaurant.reviews.push(reviewData);
      await restaurant.save();
      // Update order flag
      await Order.findByIdAndUpdate(orderId, { restaurantReviewed: true });
      // Save to review DB
      await Review.create({ ...reviewData, restaurant: restaurantId });
    }

    return res.status(200).json({ message: "Review submitted" });
  } catch (error) {
    console.error("Submit review failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports ={addFoodReview,addRestaurantReview,submitReview}