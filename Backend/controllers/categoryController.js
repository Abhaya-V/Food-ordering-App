const categoryData = require("../models/CategoryModel");

// get categories
const getCategories = async (req, res) => {
  try {
    const categories = await categoryData.find();
    res.json(categories);
  } catch (err) {
    console.error("Error getting categories:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
};

//  Add a new category
const addCategory = async (req, res) => {
  const { cat, catimg } = req.body;
  try {
    const existing = await categoryData.findOne({ cat });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const newCat = new categoryData({ cat, catimg });
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ message: "Error creating category" });
  }
};
module.exports ={getCategories, addCategory}