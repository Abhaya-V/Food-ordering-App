import React, { useEffect, useState } from 'react';
import ReviewModal from '../components/ReviewModal';
import axiosInstance from "../../axiosInterceptor";
import axios from "axios"

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentReview, setCurrentReview] = useState({ orderId: null, foodId: null, type: "", foodName: "" });
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/order/getMyOrder");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };
  fetchOrders();
}, []);

  const handleOpenModal = (orderId, type, foodId = null, foodName = "") => {
    setCurrentReview({ orderId, type, foodId, foodName });
    setShowModal(true);
  };

const handleSubmitReview = async ({ rating, comment }) => {
  try {
    const { orderId, foodId, type } = currentReview;
    await axiosInstance.post("/api/reviews/submit", {
      orderId,
      foodId,
      type,
      rating,
      comment,
      restaurantId: type === "restaurant"
        ? orders.find(o => o._id === orderId)?.cartItems[0]?.foodId?.restaurant?._id
        : null,
    });
    //  Update orders state in-memory
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order._id !== orderId) return order;
        if (type === "food") {
          return {
            ...order,
            cartItems: order.cartItems.map(item =>
              item.foodId._id === foodId ? { ...item, reviewed: true } : item
            ),
          };
        } else if (type === "restaurant") {
          return {
            ...order,
            restaurantReviewed: true,
          };
        }
        return order;
      })
    );
    alert("Review submitted!");
    setShowModal(false);
  } catch (error) {
    console.error("Review submission failed", error);
    alert("Failed to submit review.");
  }
};

 return (
  <div className="container py-4">
    <h2 className="text-center mb-5 text-uppercase">My Orders</h2>
    {loading ? (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : orders.length === 0 ? (
      <p className="text-center fs-5 text-muted">You haven't placed any orders yet.</p>
    ) : (
      orders.map((order) => (
        <div key={order._id} className="card mb-4 shadow border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                 <p className="mb-1">Order ID: {order.orderId} </p>
                <p className="mb-1">Placed On: {new Date(order.createdAt).toLocaleString()}</p>
                <p className="mb-1">Status: <span className={`badge ${order.orderStatus === "Pending" ? "bg-warning text-dark" : "bg-success"}`}>{order.orderStatus}</span></p>
                <p className="mb-1">Payment: {order.paymentStatus}</p>
              </div>
              <div>
                <h5 className="text-end text-success">₹{order.totalAmount}</h5>
              </div>
            </div>
            <hr />
            <div>
              <h6 className="mb-3">Items Ordered:</h6>
              {order.cartItems.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <div>
                    <strong>{item.foodId?.name}</strong>
                    <br />
                    <small className="text-muted">From: {item.foodId?.restaurant?.name}</small>
                  </div>
                  <span className="text-muted">Qty: {item.quantity}</span>
                  {order.orderStatus === "Delivered" && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        handleOpenModal(order._id, "food", item.foodId?._id, item.foodId?.name)
                      }
                      disabled={item.reviewed}
                    >
                      {item.reviewed ? "Reviewed" : "Review Food"}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {order.orderStatus === "Delivered" && (
              <div className="text-end mt-3">
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleOpenModal(order._id, "restaurant")}
                  disabled={order.restaurantReviewed}
                >
                  {order.restaurantReviewed ? "Restaurant Reviewed" : "Review Restaurant"}
                </button>
              </div>
            )}
          </div>
        </div>
      ))
    )}
    {/* Review Modal */}
    <ReviewModal
      show={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={handleSubmitReview}
      type={currentReview.type}
      foodName={currentReview.foodName}
    />
  </div>
);

};

export default MyOrder;
