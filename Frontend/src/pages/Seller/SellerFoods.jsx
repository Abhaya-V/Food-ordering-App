import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInterceptor";
import { useNavigate } from "react-router-dom";

const SellerFoods = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const fetchSellerFoods = async () => {
    try {
       setLoading(true);
      const res = await axiosInstance.get("/seller/foods");
      setFoods(res.data);
    } catch (err) {
      alert("Failed to fetch food items");
    }finally {
    setLoading(false);
  }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axiosInstance.delete(`/seller/foods/${id}`);
      fetchSellerFoods();
    } catch (err) {
      alert("Failed to delete food item");
    }
  };

  useEffect(() => {
    fetchSellerFoods();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Food Items</h3>
        <button
          className="btn btn-success"
          onClick={() => navigate("/seller/addfood")}
        >
          Add New Food
        </button>
      </div>
     {loading ? (
  <div className="text-center mt-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
) : (
  foods.length === 0 ? (
    <div className="alert alert-info">No food items found.</div>
  ) : (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Type</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((item) => (
            <tr key={item._id}>
              <td>
                {item.image ? (
                  <img
                    src={item.image}
                    alt="food"
                    style={{ height: "50px", width: "50px", objectFit: "cover" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.category?.cat || "-"}</td>
              <td>{item.type}</td>
              <td>₹{item.price}</td>
              <td>
                <span>{item.quantity}</span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => navigate(`/seller/editfood/${item._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
)}
    </div>

  );
};

export default SellerFoods;
