const cartData = require("../models/CartModel");
const foodData = require("../models/FoodModel");

// add food to cart
const addCarts = async (req, res) => {
  const userId = req.user.userId;
  const { foodId } = req.body;
  try {
    let cartItem = await cartData.findOne({ userId, foodId }); 
    if (!cartItem) {
      cartItem = new cartData({ userId, foodId, quantity: 1 });
    } else {
      cartItem.quantity += 1;
    }
    await cartItem.save();
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("adding cart error:", error);
    res.status(400).json({ message: "error in add food to cart" });
  }
};

// get cart items
const getCarts = async (req, res) => {
  const userId = req.user.userId;
  try {
    // view cart with full food and restaurent info
    const cartItems = await cartData.find({ userId }).populate({
      path: "foodId",
      populate: {
        path: "restaurant",
        model: "restaurant",
      },
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("getting cart items:", error);
    res.status(400).json({ message: "Error fetching cart items" });
  }
};

// update cart
const updateCarts = async (req, res) => {
  const userId = req.user.userId;
  const { foodId, action } = req.body;
  try {
    // find food item in cartmodel
    const cartItem = await cartData.findOne({ userId, foodId });
    if (!cartItem) {
      return res.status(400).json({ message: "Cart item not found" });
    }
    // find food item in foodmodel
    const food = await foodData.findById(foodId);
    if (!food) {
      return res.status(400).json({ message: "Food not found" });
    }
    // increase action
    if (action === "increase") {
      if (cartItem.quantity >= food.quantity) {
        return res
          .status(400)
          .json({ message: "Only limited stock available" });
      }
      cartItem.quantity += 1;
    }
    // decrease action
    else if (action === "decrease") {
      if (cartItem.quantity <= 1) {
        await cartItem.deleteOne();
        return res.status(200).json({ message: "Item removed" });
      }
      cartItem.quantity -= 1;
    }
    await cartItem.save();
    res.status(200).json({ quantity: cartItem.quantity });
  } catch (error) {
    console.error("updating quantity:", error);
    res.status(400).json({ message: "Failed to update quantity" });
  }
};

// deletind cart
const deleteCarts = async (req, res) => {
  const userId = req.user.userId;
  const { foodId } = req.body;
  try {
    // find and delete
    const deletedItem = await cartData.findOneAndDelete({ userId, foodId });
    // if the item is not there
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("deleting cart items error:", error);
    res.status(500).json({ message: "Failed to delete item from cart" });
  }
};

// clear cart
const clearCarts = async (req, res) => {
  const userId = req.user.userId;
  await cartData.deleteMany({ userId });
  res.json({ message: "Cart cleared" });
};

module.exports = { addCarts, getCarts, updateCarts, deleteCarts, clearCarts };
