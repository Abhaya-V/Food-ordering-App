import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../axiosInterceptor";

const Cart = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/cart/get/user");
      setCartItems(res.data);
      updateCartCount(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchCart();
}, []);

  const updateCartCount = (items) => {
    setCartCount(items.length);
  };

  const handleQuantity = (foodId, delta) => {
    const action = delta === 1 ? "increase" : "decrease";
    axiosInstance
      .put("/api/cart/update", { foodId, action })
      .then((res) => {
        let updatedCart;
        if (res.data.message === "Item removed") {
          updatedCart = cartItems.filter((item) => item.foodId._id !== foodId);
        } else {
          const newQuantity = res.data.quantity;
          updatedCart = cartItems.map((item) =>
            item.foodId._id === foodId ? { ...item, quantity: newQuantity } : item
          );
        }
        setCartItems(updatedCart);
        updateCartCount(updatedCart);
      })
      .catch((err) => console.error("Quantity update failed:", err));
  };

  const handleDelete = (foodId) => {
    axiosInstance
      .delete("/api/cart/delete", { data: { foodId } })
      .then(() => {
        const updatedCart = cartItems.filter((item) => item.foodId._id !== foodId);
        setCartItems(updatedCart);
        updateCartCount(updatedCart);
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.foodId.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/shipping", {
      state: {
        totalPrice,
        cartItems,
      },
    });
  };

 return (
  <div className="container mt-4">
    <h2 className="text-center mb-4 fw-bold">Your Cart</h2>

    {loading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : cartItems.length === 0 ? (
      <div className="text-center">
        <p className="mt-3 fs-5">Your cart is empty. Add something delicious!</p>
        <Link to="/" className="btn btn-primary mt-3">Back To Home</Link>
      </div>
    ) : (
      <div className="row">
        <div className="col-md-8">
          {cartItems.map((item) => (
            <div
              className="card mb-3 shadow-sm p-3 d-flex flex-row align-items-center gap-3"
              key={item._id}
            >
              <img
                src={item.foodId.image}
                alt={item.foodId.name}
                className="rounded"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <h5 className="mb-1">{item.foodId.name}</h5>
                <small className="text-muted d-block">{item.foodId.restaurant?.name}</small>
                <p className="mb-1 fw-semibold">₹{item.foodId.price}</p>
                <div className="d-flex align-items-center mt-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuantity(item.foodId._id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuantity(item.foodId._id, 1)}
                    disabled={item.quantity >= item.foodId.quantity}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleDelete(item.foodId._id)}
              >
                <MdDelete size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card shadow p-4 sticky-top" style={{ top: "80px" }}>
            <h4 className="mb-3">Order Summary</h4>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax (5%)</span>
              <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>₹{(totalPrice * 1.05).toFixed(2)}</span>
            </div>
            <button className="btn btn-success w-100 mt-4" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default Cart;
