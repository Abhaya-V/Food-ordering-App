const mongoose = require("mongoose");
const FoodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant", 
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["veg", "non-veg"],
    required: true
  },

  image: { 
    type: String 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",  
    required: true,
  },
  description: { 
    type: String 
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  quantity: { 
    type: Number, 
    default: 0 
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ]
});

const FoodData = mongoose.model("food",FoodSchema)
module.exports = FoodData