import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInterceptor";
import axios from "axios";

const AdminChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      const res = await axios.put(
        "https://food-ordering-app-back.vercel.app/admin/update",
        {
          email,
          newPassword,
        }
      );
      setSuccess(res.data.message || "Password updated successfully");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ height: "89.3vh", overflow: "hidden" }}>
        <div className="col-md-6 d-none d-md-block">
          <img
            src="/banner.jpg"
            alt="admin update"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-secondary">
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <form
              onSubmit={handleSubmit}
              className="shadow p-4 border bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-4">Update Admin Credentials</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label>New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">
                Update & Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChangePassword;
