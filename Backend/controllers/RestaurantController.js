const resData = require("../models/RestaurantModel")
const reverseGeocode = require('../utils/reverseGeocode')

// add new restaurant
const addrestaurant =  async (req, res) => {
  try {
    const { name, latitude, longitude, image, description, rating } = req.body;
    const geo = await reverseGeocode(latitude, longitude);
   console.log("Geo Address & City:", geo.address, geo.city);
    if (!geo) return res.status(400).json({ message: "Invalid coordinates" });

    const newRestaurant = await resData.create({
      name,
      address: geo.address,
      city: geo.city,
      image,
      description,
      rating,
      latitude,
      longitude,
    });
    res.status(201).json({ message: "Restaurant created", restaurant: newRestaurant });
  } catch (err) {
    console.error("Restaurant creation failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// getting restaurent
const getrestaurant = async (req, res) => {
  try {
    const restaurants = await resData.find()
    res.status(200).json(restaurants)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    res.status(500).json({ message: "Failed to get restaurants" })
  }
};

// get restaurent by Id
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await resData.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });
    res.json({
      name: restaurant.name,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports ={addrestaurant,getrestaurant,getRestaurantById}