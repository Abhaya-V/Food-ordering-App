import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { IoMdStarOutline } from "react-icons/io";
import axiosInstance from "../../axiosInterceptor";


const detectLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lon: longitude });
      },
      (error) => {
        reject(error.message || "Location access denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};


const Home = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [foodType, setFoodType] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handleLocationAndData();
  }, []);

  const handleLocationAndData = async () => {
    let cityKeyword = "";
    const token = sessionStorage.getItem("token");

    if (token) {
      try {
        // logged- in user
        const userRes = await axiosInstance.get("/api/users/user-info");
        const user = userRes.data;
        // location update 
        if (user?.location?.city || !user?.location?.city) {
          const { lat, lon } = await detectLocation();
          await axiosInstance.put("/api/users/update-location", { lat, lon });
          // reverse geocoding
          const geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          cityKeyword =
            geoRes.data.address.city ||
            geoRes.data.address.town ||
            geoRes.data.address.village ||
            geoRes.data.address.state_district||
            geoRes.data.address.state ||
            "";
           console.log("Reverse Geocode Address:", geoRes.data.address);
          console.log("Reverse Geocode city",cityKeyword)
        }
       
      } catch (err) {
        console.log(err)
        console.warn("Something went wrong while fetching user info.");
      }
    } else {
      try {
        // guest login
        const { lat, lon } = await detectLocation();
        const geoRes = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        cityKeyword =
          geoRes.data.address.city ||
          geoRes.data.address.town ||
          geoRes.data.address.village ||
          geoRes.data.address.state_district||
          geoRes.data.address.state ||
          "";
          console.log("Reverse Geocode Address:", geoRes.data.address);
          console.log("Reverse Geocode city",cityKeyword)
      } catch {
        cityKeyword = "";
      }
    }

    await fetchData(cityKeyword.toLowerCase());
  };

  const fetchData = async (cityKeyword = "") => {
    try {
      const [resRes, catRes, foodRes] = await Promise.all([
        axios.get("https://food-ordering-app-back.vercel.app/api/restaurant/get"),
        axios.get("https://food-ordering-app-back.vercel.app/api/categories/get"),
        axios.get("https://food-ordering-app-back.vercel.app/api/foods/get"),
      ]);

      const filteredRestaurants = cityKeyword
        ? resRes.data.filter((r) =>
            r.address?.toLowerCase().includes(cityKeyword)
          )
        : resRes.data;

      const filteredFoods = foodRes.data.filter(
        (food) =>
          food.restaurant &&
          filteredRestaurants.some((r) => r._id === food.restaurant._id)
      );

      setUserCity(cityKeyword);
      setRestaurants(filteredRestaurants);
      setCategories(catRes.data);
      setFoods(filteredFoods);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigate("/foods", { state: { searchTerm: search } });
  };

  const handleCategoryClick = (category) => {
    navigate("/foods", { state: { category } });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredFoods = foods
    .filter(
      (food) =>
        (!selectedCategory || food.category.cat === selectedCategory) &&
        (!selectedRestaurant || food.restaurant.name === selectedRestaurant) &&
        (!foodType || food.type === foodType)
    )
    .sort((a, b) => {
      if (sortOption === "priceLow") return a.price - b.price;
      if (sortOption === "priceHigh") return b.price - a.price;
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "nameAZ") return a.name.localeCompare(b.name);
      if (sortOption === "nameZA") return b.name.localeCompare(a.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="text-center my-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div>
      <div className="position-relative">
        <img
          src="/banner.jpg"
          alt="Banner"
          className="w-100"
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold">Welcome to Foodie</h1>
          <p className="lead">Delicious meals delivered to your door</p>
          <div className="input-group my-4 container">
            <input
              type="text"
              className="form-control"
              placeholder="Search for dishes or restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <CiSearch />
            </button>
          </div>
          <Link to="/foods">
            <button className="btn btn-primary">Explore All Foods</button>
          </Link>
        </div>
      </div>

      <div className="container my-5">
        <h3 className="text-center mb-4">Explore by Category</h3>
        <div className="d-flex overflow-auto gap-5">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryClick(cat.cat)}
            >
              <img
                src={cat.catimg}
                alt={cat.cat}
                className="rounded-circle border"
                style={{ width: 80, height: 80, objectFit: "cover" }}
              />
              <p className="mt-2">{cat.cat}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container my-4">
        <h4 className="text-center mb-3">
          {selectedCategory ? `Showing: ${selectedCategory}` : "All Foods"}
        </h4>

        <div className="mb-4 row g-3 align-items-center justify-content-center">
          <div className="col-md-2">
            <select
              className="form-select"
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
            >
              <option value="">All Restaurants</option>
              {restaurants.map((res) => (
                <option key={res._id} value={res.name}>
                  {res.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="veg"> Veg</option>
              <option value="non-veg"> Non-Veg</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="">Sort By</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="nameAZ">Name A-Z</option>
              <option value="nameZA">Name Z-A</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedRestaurant("");
                setFoodType("");
                setSortOption("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="row">
          {filteredFoods.length === 0 ? (
            <p className="text-center">No foods found for this filter.</p>
          ) : (
            filteredFoods.map((food) => (
              <div className="col-md-4 mb-3" key={food._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={food.image}
                    className="card-img-top"
                    alt={food.name}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5>{food.name}</h5>
                    <p
                      className={`fw-bold ${
                        food.type === "veg" ? "text-success" : "text-danger"
                      }`}
                    >
                      {food.type === "veg" ? " Veg" : "Non-Veg"}
                    </p>
                    <p>₹{food.price}</p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/food/${food._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="container mt-5">
        <h3 className="mb-4 text-center">
          Restaurants in {userCity || "your area"}
        </h3>
        <div className="row">
          {restaurants.length === 0 ? (
            <p className="text-center text-muted">
              No top-rated restaurants found in your area.
            </p>
          ) : (
            restaurants.map((res) => (
              <div className="col-md-4 mb-4" key={res._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={res.image}
                    className="card-img-top"
                    alt={res.name}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body text-center bg-dark text-light">
                    <h5>{res.name}</h5>
                    <p>{res.address}</p>
                    <p>
                      <IoMdStarOutline size={22} />{" "}
                      {res.reviews && res.reviews.length > 0
                        ? (
                            res.reviews.reduce((acc, r) => acc + r.rating, 0) /
                            res.reviews.length
                          ).toFixed(1)
                        : "No ratings"}
                    </p>
                    <Link
                      to={`/restaurant/${res._id}`}
                      className="btn btn-outline-light"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="bg-dark text-white text-center p-3 mt-5">
        <p>&copy; 2025 Foodie. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
