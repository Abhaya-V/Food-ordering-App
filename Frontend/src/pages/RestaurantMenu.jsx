import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInterceptor";

const RestaurantMenu = () => {
  const { id } = useParams()
  const [foods, setFoods] = useState([])
  const [restaurant, setRestaurant] = useState(null)
    const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

// Fetch food items of specific restaurant
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const foodRes = await axiosInstance.get(
        `/api/foods/get/byRestaurant/${id}`
      );
      setFoods(foodRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);

// Fetch restaurant info
useEffect(() => {
  axios
    .get(`https://food-ordering-app-back.vercel.app/api/restaurant/get`)
    .then((res) => {
      const match = res.data.find((r) => r._id === id);
      setRestaurant(match);
    })
    .catch((err) => console.log(err));
}, [id]);

  const handleAddToCart = async (foodId, restaurantId) => {
    try {
      const res = await axiosInstance.get(
        "/api/cart/get/user"
      )
      const existingCart = res.data
        // checks whether the food items in cart are same res
      if (existingCart.length > 0) {
        const existingRestaurant = existingCart[0].foodId.restaurant
        const existingRestaurantId = existingRestaurant._id
        if (existingRestaurantId !== restaurantId) {
          const confirmClear = window.confirm(
            "Your cart has items from another restaurant. Clear cart and continue?"
          )
          if (!confirmClear) return
          await axiosInstance.post("/api/cart/clear")
        }
      }
      // Proceed to add
      await axiosInstance.post("/api/cart/add", {
        foodId
      })
      navigate("/cart")
    } catch (err) {
      console.error("Add to cart error:", err)
      alert("Failed to add item to cart.")
    }
  }

 return (
  <div>
    {restaurant && (
      <div
        className="banner text-white d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          height: "300px",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${restaurant.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="display-4 fw-bold">{restaurant.name}</h1>
      </div>
    )}

    <div className="container mt-4">
      <h3 className="mb-3 text-center">Menu Items</h3>
      <hr />
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row mt-4">
          {foods.length > 0 ? (
            foods.map((food) => (
              <div className="col-md-4 mb-4" key={food._id}>
                <div className="card h-100 bg-dark text-white">
                  <img
                    src={food.image}
                    className="card-img-top"
                    alt={food.name}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5>{food.name}</h5>
                    <p>{food.description}</p>
                    <p>₹{food.price}</p>
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
            <p className="text-center">No food items available.</p>
          )}
        </div>
      )}
    </div>
  </div>
);
};

export default RestaurantMenu;
