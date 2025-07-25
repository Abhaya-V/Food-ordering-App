import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://food-ordering-app-back.vercel.app/api/order/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-1">
      <h2 className="mb-4 text-center">Order Management</h2>
      {orders.length === 0 ? (
        <div className="alert alert-warning">No orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.userId?.username || "N/A"}</td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {order.cartItems.map((item, idx) => (
                        <li key={idx}>
                          {item.foodId?.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {order.cartItems[0]?.foodId?.restaurant?.name || "N/A"}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.orderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
