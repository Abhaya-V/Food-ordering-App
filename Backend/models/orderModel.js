const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  cartItems: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
      },
      quantity: Number,
      reviewed: {
  type: Boolean,
  default: false,
},
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
    shippingInfo: {
    address: String,
    city: String,
    pincode: String,
    country: String,
    phone: String,
  },
  paymentStatus: {
    type: String,
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: ["Placed", "Preparing", "Delivered", "Cancelled"],
    default: "Placed",
  },
  remark: {
  type: String,
  default: "",
},
restaurantReviewed: {
  type: Boolean,
  default: false,
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderData = mongoose.model("Order", orderSchema);
module.exports = orderData