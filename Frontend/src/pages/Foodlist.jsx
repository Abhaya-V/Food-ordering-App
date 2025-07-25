import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInterceptor";

const Foodlist = () => {
  const [foods, setFoods] = useState([]);
  const location = useLocation();
  const searchTerm = location.state?.searchTerm?.toLowerCase() || "";
  const category = location.state?.category || "";
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // when addtocart clicked
  const handleAddToCart = async (foodId, restaurantId) => {
    try {
      const res = await axiosInstance.get(
        "/api/cart/get/user"
      );
      const existingCart = res.data;
      if (existingCart.length > 0) {
        const existingRestaurant = existingCart[0].foodId.restaurant;
        const existingRestaurantId = existingRestaurant._id;
        if (existingRestaurantId !== restaurantId) {
          const confirmClear = window.confirm(
            "Your cart has items from another restaurant. Clear cart and continue?"
          );
          if (!confirmClear) return;
          await axiosInstance.post("/api/cart/clear");
        }
      }
      await axiosInstance.post("/api/cart/add", {
        foodId,
      });
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart.");
    }
  };
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const userRes = await axiosInstance.get(
          "/api/users/user-info"
        );
        const userCity = userRes.data.location?.city?.toLowerCase();

        const [foodRes, restaurantRes] = await Promise.all([
          axiosInstance.get("/api/foods/get"),
          axiosInstance.get("/api/restaurant/get"),
        ]);

        const allFoods = foodRes.data;
        const allRestaurants = restaurantRes.data;

        // Filter restaurants by user city
        const localRestaurantIds = allRestaurants
          .filter((res) => res.address?.toLowerCase().includes(userCity))
          .map((res) => res._id);

        // Filter foods whose restaurant is in user's city
        let filtered = allFoods.filter((food) =>
          localRestaurantIds.includes(food.restaurant?._id || food.restaurant)
        );

        // Apply category filter
        if (category) {
          filtered = filtered.filter((food) => food.category?.cat === category);
        }

        // Apply search filter
        if (searchTerm) {
          filtered = filtered.filter(
            (food) =>
              food.name.toLowerCase().includes(searchTerm) ||
              food.restaurant?.name?.toLowerCase().includes(searchTerm)
          );
        }

        setFoods(filtered);
      } catch (err) {
        console.log("Error fetching foods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [category, searchTerm]);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">
        {category
          ? `Showing "${category}" Foods`
          : searchTerm
          ? `Search Results for "${searchTerm}"`
          : "All Foods"}
      </h2>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {foods.length > 0 ? (
            foods.map((food) => (
              <div className="col-md-4 mb-4" key={food._id}>
                <div className="card h-100 border border-dark">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body text-center bg-dark text-light">
                    <h5 className="card-title">{food.name}</h5>
                    <p className="text-light mb-1">{food.restaurant?.name}</p>
                    <p className="card-text">{food.description}</p>
                    <p className="fw-bold">₹{food.price}</p>
                    {food.quantity === 0 ? (
                      <button disabled className="btn btn-secondary">
                        Out of Stock
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleAddToCart(
                            food._id,
                            food.restaurant._id || food.restaurant
                          )
                        }
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No foods found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Foodlist;
