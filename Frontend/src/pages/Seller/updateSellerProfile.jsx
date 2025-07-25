import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInterceptor";

const EditSellerProfile = () => {
  const [form, setForm] = useState({
    sellerName: "",
    phone: "",
    email: "",
    restaurantName: "",
    description: "",
    image: "", 
  });

  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/seller/profile");
      setForm(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/seller/profile", form);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage("Failed to update profile.");
      console.error("Update error", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4 text-center">Edit Seller Profile</h3>
        {message && (
          <div className={`alert ${message.startsWith("Profile Updated success") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Seller Name</label>
              <input
                className="form-control"
                name="sellerName"
                value={form.sellerName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Email (read-only)</label>
            <input
              className="form-control"
              name="email"
              value={form.email}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Restaurant Name</label>
            <input
              className="form-control"
              name="restaurantName"
              value={form.restaurantName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Restaurant Description</label>
            <textarea
              className="form-control"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Restaurant Image URL</label>
            <input
              className="form-control"
              name="image"
              value={form.image}
              onChange={handleChange}
            />
          </div>
          {form.image && (
            <div className="text-center mb-4">
              <img
                src={form.image}
                alt="Restaurant Preview"
                className="img-thumbnail rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
            </div>
          )}
          <button className="btn btn-primary w-100">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSellerProfile;
