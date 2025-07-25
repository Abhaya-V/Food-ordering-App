import React, { useState } from "react";
import axios from "../../../axiosInterceptor";
import { useNavigate, Link } from "react-router-dom";

const SellerSignup = () => {
  const [form, setForm] = useState({
    restaurantName: "",
    latitude: "",
    longitude: "",
    sellerName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/seller/signup", form);
      setMessage(res.data.message);
      setError("");
      setForm({
        restaurantName: "",
        latitude: "",
        longitude: "",
        sellerName: "",
        phone: "",
        email: "",
        password: "",
      });
      navigate("/seller/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ height: "89.3vh", overflow: "hidden" }}>
        <div className="col-md-5 d-none d-md-block">
          <img
            src="/banner.jpg"
            alt="signup"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="col-md-7 d-flex align-items-center justify-content-center bg-secondary">
          <div style={{ maxWidth: "650px", width: "100%" }}>
            <form
              onSubmit={handleSubmit}
              className="shadow p-4 border bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-3">Seller Signup</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Seller Name:</label>
                  <input
                    className="form-control"
                    name="sellerName"
                    onChange={handleChange}
                    value={form.sellerName}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Phone:</label>
                  <input
                    className="form-control"
                    name="phone"
                    onChange={handleChange}
                    value={form.phone}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                    value={form.email}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Password:</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      onChange={handleChange}
                      value={form.password}
                      required
                    />
                    <span
                      className="input-group-text bg-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                    </span>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Restaurant Name:</label>
                  <input
                    className="form-control"
                    name="restaurantName"
                    onChange={handleChange}
                    value={form.restaurantName}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label>Latitude:</label>
                  <input
                    className="form-control"
                    name="latitude"
                    onChange={handleChange}
                    value={form.latitude}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label>Longitude:</label>
                  <input
                    className="form-control"
                    name="longitude"
                    onChange={handleChange}
                    value={form.longitude}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success w-100">
                Register
              </button>
              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/seller/login" className="text-info">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;
