import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInterceptor";

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalWeeklyOrders: 0,
    totalDelivered: 0,
    totalRevenue: 0,
    todayOrders: 0,
    totalFoodItems: 0,
    outOfStock: 0,
  });
  const fetchDashboardStats = async () => {
    try {
      const res = await axiosInstance.get("/seller/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Seller Dashboard</h2>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h5>Total Foods</h5>
              <h3>{stats.totalFoodItems}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white shadow">
            <div className="card-body">
              <h5>Out of Stock</h5>
              <h3>{stats.outOfStock}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <h5>Today's Orders</h5>
              <h3>{stats.todayOrders}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary text-white shadow">
            <div className="card-body">
              <h5>This Week's Orders</h5>
              <h3>{stats.totalWeeklyOrders}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h5>Delivered This Week</h5>
              <h3>{stats.totalDelivered}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark text-white shadow">
            <div className="card-body">
              <h5>Total Earnings (This Week)</h5>
              <h3>₹{stats.totalRevenue}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
