const express = require("express");
const axios = require("axios");
const router = express.Router();

// here shipping address is taken to convert into lat and long
router.get("/coords", async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ message: "Address is required" });
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
      {
        headers: { "User-Agent": "Foodie" }, 
      }
    );
    if (response.data.length === 0) {
      return res.status(404).json({ message: "No location found" });
    }
    const { lat, lon } = response.data[0];
    res.json({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
  } catch (err) {
    console.error("Geocoding error:", err.message);
    res.status(500).json({ message: "Geocoding failed" });
  }
});

module.exports = router;
