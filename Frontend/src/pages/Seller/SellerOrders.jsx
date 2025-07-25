import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInterceptor";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); 

  const fetchOrders = async () => {
    setLoading(true); 
    try {
      const res = await axiosInstance.get("/seller/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);
    }
    setLoading(false); 
  };

  const updateStatus = async (orderId, newStatus) => {
    setLoading(true); 
    try {
      await axiosInstance.put(`/seller/orders/${orderId}/status`, {
        status: newStatus,
      });
      await fetchOrders(); 
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-1">
      <h3 className="mb-4 text-center">Customer Orders</h3>
      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && orders.length === 0 ? (
        <div className="alert alert-info">No orders available</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-3 shadow-sm">
            <div className="card-header d-flex justify-content-between">
              <div>
                <strong>Order ID:</strong> {order.orderId}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    order.orderStatus === "Delivered"
                      ? "bg-success"
                      : order.orderStatus === "Preparing"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>
            <div className="card-body">
              <p>
                <strong>User:</strong> {order.userId?.username}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Shipping:</strong> {order.shippingInfo.address},{" "}
                {order.shippingInfo.city}, {order.shippingInfo.pincode}
              </p>
              <p>
                <strong>Items:</strong>
              </p>
              <ul className="list-group mb-2">
                {order.cartItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {item.foodId?.name || "Deleted Item"} — Qty: {item.quantity}
                    <span className="badge bg-primary">
                      ₹{item.foodId?.price || 0}
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                <strong>Remark:</strong>{" "}
                {order.remark ? order.remark : "No Remark"}
              </p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={order.orderStatus === "Preparing" || loading}
                  onClick={() => updateStatus(order._id, "Preparing")}
                >
                  Mark as Preparing
                </button>
                <button
                  className="btn btn-outline-success btn-sm"
                  disabled={order.orderStatus === "Delivered" || loading}
                  onClick={() => updateStatus(order._id, "Delivered")}
                >
                  Mark as Delivered
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrders;
