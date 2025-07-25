import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInterceptor";
import { IoMdStarOutline } from "react-icons/io";

const FoodDetails = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/foods/get/${id}`
        );
        setFood(res.data);
      } catch (err) {
        console.error("Error loading food details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const res = await axiosInstance.get(
        "/api/cart/get/user"
      );
      const existingCart = res.data;

      if (existingCart.length > 0) {
        const existingRestaurant = existingCart[0].foodId.restaurant;
        const existingRestaurantId =
          existingRestaurant._id || existingRestaurant;
        const currentRestaurantId = food.restaurant._id || food.restaurant;
        if (existingRestaurantId !== currentRestaurantId) {
          const confirmClear = window.confirm(
            "Your cart has items from a different restaurant. Clear cart and continue?"
          );
          if (!confirmClear) return;
          // Clear existing cart
          await axiosInstance.post("/api/cart/clear");
        }
      }
      // Add current item to cart
      await axiosInstance.post("/api/cart/add", {
        foodId: food._id,
      });
      navigate("/cart");
    } catch (err) {
      console.error("Cart error:", err);
      alert("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading || !food) return <p className="text-center my-5">Loading...</p>;

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={food.image}
            alt={food.name}
            className="img-fluid rounded shadow"
            style={{ height: "100%", maxHeight: "500px", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6">
          <h2>{food.name}</h2>
          <p className="mb-2 text-muted">{food.restaurant?.name}</p>
          <p className="fw-bold fs-5">₹{food.price}</p>
          <p className="text-muted">{food.description}</p>

          <p
            className={`fw-bold ${
              food.type === "veg" ? "text-success" : "text-danger"
            }`}
          >
            {food.type === "veg" ? " Veg" : " Non-Veg"}
          </p>
          <p>
            <strong>Availability:</strong>{" "}
            {food.quantity > 0 ? (
              <span className="text-success">In Stock</span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )}
          </p>
          {food.reviews && food.reviews.length > 0 ? (
            <>
              <p className="fw-bold">
                <IoMdStarOutline size={22} />{" "}
                {(
                  food.reviews.reduce((acc, r) => acc + r.rating, 0) /
                  food.reviews.length
                ).toFixed(1)}{" "}
                <span className="text-muted">
                  ({food.reviews.length} reviews)
                </span>
              </p>

              <div className="border rounded p-3 bg-light mb-3">
                <h6 className="fw-bold mb-3">Customer Reviews</h6>
                {food.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="mb-2">
                    <strong>{review.name}</strong> — <IoMdStarOutline size={22} /> {review.rating}
                    <p className="mb-1">{review.comment}</p>
                    <hr className="my-2" />
                  </div>
                ))}
                {food.reviews.length > 3 && (
                  <p className="text-muted">
                    ...and {food.reviews.length - 3} more reviews
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-muted">No reviews yet</p>
          )}

          <div className="border rounded p-3 bg-light my-3">
            <h6 className="fw-bold mb-2">Available Offers</h6>
            <ul className="list-unstyled mb-0">
              <li> 20% off on orders above ₹2000</li>
              <li> Free delivery under 5 km</li>
            </ul>
          </div>

          {food.quantity > 0 ? (
            <button
              className="btn btn-primary w-100"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          ) : (
            <button className="btn btn-secondary w-100" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
