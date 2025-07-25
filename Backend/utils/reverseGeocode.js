const axios = require("axios");

// seller give lat and long to find the address 
const reverseGeocode = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Foodie",
      },
    });
    const data = res.data;
    const address = data.display_name;
    const components = data.address;
    const city =
      components.city ||
      components.state_district ||
      components.town || 
      components.state || 
      components.county;
    return {
      address,
      city: city?.toLowerCase() || "",
    };
  } catch (err) {
    console.error("Nominatim geocoding error:", err.message);
    return null;
  }
};

module.exports = reverseGeocode;
