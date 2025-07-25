const orderData = require("../models/orderModel");
const Food = require("../models/FoodModel");
const User = require("../models/UserModel")
const {sendPaymentSuccessEmail} = require("../utils/SendEmail.js");

// generate a custom order ID
const generateOrderId = async () => {
  const count = await orderData.countDocuments();
  const id = count + 1;
  return `ORD${id.toString().padStart(6, "0")}`;  //  ORD000001
};
// create
const createOrder = async (req, res) => {
  const userId = req.user.userId
  const { totalAmount, shippingInfo, cartItems,remark } = req.body
  try {
    const orderId = await generateOrderId();
     const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    //  Create order
    const newOrder = new orderData({
      orderId,
      userId,
      totalAmount,
      shippingInfo,
      cartItems,
      remark,
      paymentStatus: "success",
    })
    await newOrder.save()
    //  Reduce quantity of food items
    for (const item of cartItems) {
      const food = await Food.findById(item.foodId)
      food.quantity -= item.quantity
      await food.save()
    }
    await sendPaymentSuccessEmail(user.email, user.username, newOrder.orderId);
    res.status(201).json({ message: "Order placed successfully", order: newOrder })
  } catch (err) {
    console.error("Error creating order:", err)
    res.status(500).json({ message: "Failed to place order" })
  }
}

// to show myorder
const getUserOrder = async (req,res) =>{
  const userId = req.user.userId
  try{
    const orders = await orderData.find({userId})
    .populate({path: "cartItems.foodId",populate: { path: "restaurant", select: "name" }})
     .sort({ createdAt: -1 })
     res.status(200).json(orders)
  }
  catch(err){
    console.error("Error in getting order:" ,err)
     res.status(500).json({ message: "Failed to get order" })
  }
}

// to get the shipping details
const getLatestShippingInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const latestOrder = await orderData.findOne({ userId })
      .sort({ createdAt: -1 })
      .select("shippingInfo");
    if (!latestOrder) {
      return res.status(404).json({ message: "No previous orders found" });
    }
    res.status(200).json({ shippingInfo: latestOrder.shippingInfo });
  } catch (err) {
    console.error("Error fetching latest shipping info:", err);
    res.status(500).json({ message: "Failed to fetch shipping info" });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderData
      .find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email")
      .populate({
        path: "cartItems.foodId",
        populate: { path: "restaurant", select: "name _id" },
      });

    const restaurantSummary = {};

    orders.forEach(order => {
      if (
        order.cartItems.length > 0 &&
        order.orderStatus === "Delivered"
      ) {
        const food = order.cartItems[0].foodId;
        const restaurant = food.restaurant;

        if (restaurant) {
          const resId = restaurant._id.toString();
          const resName = restaurant.name;

          if (!restaurantSummary[resId]) {
            restaurantSummary[resId] = {
              name: resName,
              revenue: 0,
              commission: 0,
            };
          }

          restaurantSummary[resId].revenue += order.totalAmount;
          restaurantSummary[resId].commission += order.totalAmount * 0.10;
        }
      }
    });

    res.status(200).json({
      orders,
      commissionReport: restaurantSummary,
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};





module.exports ={createOrder,getUserOrder,getLatestShippingInfo,getAllOrders}