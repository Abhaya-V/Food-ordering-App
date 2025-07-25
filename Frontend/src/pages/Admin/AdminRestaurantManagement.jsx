import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInterceptor";

const AdminRestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const fetchRestaurants = async () => {
    setLoading(true); 
    try {
      const res = await axiosInstance.get("/admin/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error("Error fetching restaurants", err);
    } finally {
      setLoading(false); 
    }
  };
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this restaurant?");
    if (!confirm) return;
    try {
      await axiosInstance.delete(`/admin/restaurant/${id}`);
      setMessage("Restaurant deleted successfully");
      fetchRestaurants(); 
    } catch (err) {
      console.error("Delete error", err);
    }
  };
  useEffect(() => {
    fetchRestaurants();
  }, []);
  return (
    <div className="container mt-1">
      <h2 className="mb-4 text-center">Restaurant Management</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="alert alert-warning">No restaurants found.</div>
      ) : (
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((res) => (
              <tr key={res._id}>
                <td>
                  {res.image ? (
                    <img
                      src={res.image}
                      alt="restaurant"
                      style={{ width: "60px", height: "40px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{res.name}</td>
                <td>{res.city}</td>
                <td>{res.address}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(res._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRestaurantManagement;
