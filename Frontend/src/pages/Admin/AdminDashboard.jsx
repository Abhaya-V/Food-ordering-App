import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInterceptor";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSellers: 0,
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    adminCommission: 0,
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="d-flex">
      <div className="container mt-2">
        <h2 className="mb-4 text-center">Admin Dashboard</h2>
        <div className="row">
          <DashboardCard title="Total Sellers" value={stats.totalSellers} bg="info" />
          <DashboardCard title="Total Restaurants" value={stats.totalRestaurants} bg="primary" />
          <DashboardCard title="Total Users" value={stats.totalUsers} bg="secondary" />
          <DashboardCard title="Total Orders" value={stats.totalOrders} bg="warning" />
          <DashboardCard title="Total Revenue" value={`₹${stats.totalRevenue}`} bg="success" />
          <DashboardCard title="Admin Commission (10%)" value={`₹${stats.adminCommission.toFixed(2)}`} bg="dark" />
        </div>
      </div>
    </div>
  );
};
const DashboardCard = ({ title, value, bg }) => (
  <div className="col-md-4 mb-3">
    <div className={`card text-white bg-${bg}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text fs-4">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
