const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  reviews: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    name: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }
],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Restaurant = mongoose.model("restaurant", restaurantSchema);
module.exports = Restaurant;
