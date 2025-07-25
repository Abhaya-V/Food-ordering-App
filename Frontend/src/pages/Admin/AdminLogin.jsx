import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInterceptor";
import axios from "axios"

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/admin/login", {
        email: email.toLowerCase(),
        password,
      });
      sessionStorage.setItem("token", res.data.token);
      if (res.data.isFirstLogin) {
        navigate("/admin/change-password", { state: { email: email.toLowerCase() } });
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ height: "89.3vh", overflow: "hidden" }}>
        <div className="col-md-6 d-none d-md-block">
          <img
            src="/banner.jpg"
            alt="admin login"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-secondary">
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <form
              onSubmit={handleLogin}
              className="shadow p-4 border bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-4">Admin Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Password:</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                    ></i>
                  </span>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-2">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
