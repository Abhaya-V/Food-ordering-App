const foodData = require("../models/FoodModel");
require("../models/CategoryModel");

// Get all foods with restaurant name and category populated
const getFoods = async (req, res) => {
  try {
    const foods = await foodData
      .find()
      .populate("restaurant", "name")
      .populate("category", "cat catimg"); 
    res.json(foods);
  } catch (error) {
    console.error("getting food:", error);
    res.status(500).json({ message: "error in showing food list" });
  }
};

// Add new food
const addFood = async (req, res) => {
  try {
    const newFood = await foodData.create(req.body);
    res.status(200).json(newFood);
  } catch (error) {
    console.error("adding food:", error);
    res.status(400).json({ message: "error in adding food" });
  }
};

// Get foods by restaurant ID (with category populated)
const getFoodsByres = async (req, res) => {
  try {
    const foods = await foodData
      .find({ restaurant: req.params.resId })
      .populate("category", "cat catimg");
    res.json(foods);
  } catch (err) {
    console.error("getting foods by restaurant:", err);
    res.status(500).json({ message: "Error fetching foods" });
  }
};

// get individual food
const getFoodsById = async(req,res) =>{
  try {
    const food = await foodData
      .findById(req.params.id)
      .populate("restaurant")
      .populate("category");

    if (!food) return res.status(404).json({ message: "Food not found" });

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = { getFoods, addFood, getFoodsByres ,getFoodsById};
