import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneno: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  // form validation
  const validateForm = () => {
    let isValid = true
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(formData.phoneno)) {
      newErrors.phoneno = "Invalid Indian phone number"
      isValid = false
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 6+ chars with uppercase, lowercase, number & special char"
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }

  // on onchange
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // on onsubmit
  const handleSignup = (e) => {
    e.preventDefault()
    // validation
    if (!validateForm()) return
    axios
      .post("https://food-ordering-app-back.vercel.app/api/users/register", formData)
      .then((res) => {
        console.log(res.data.message)
        navigate("/verify")
      })
      .catch((error) => {
         const errorMessage =
      error.response?.data?.message || "Signup failed. Please try again.";
    alert(errorMessage);
      })
  }
  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ height: "89.3vh", overflow: "hidden" }}>
        <div className="col-md-6 d-none d-md-block">
          <img
            src="banner.jpg"
            alt="img"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-secondary">
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <form
              onSubmit={handleSignup}
              className="shadow p-4 border bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-2">Sign Up for Foodie</h2>
              <div className="mb-2">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && (
                  <small className="text-danger">{errors.username}</small>
                )}
              </div>
              <div className="mb-2">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
              <div className="mb-2">
                <label>Phone Number:</label>
                <input
                  type="number"
                  name="phoneno"
                  className="form-control"
                  value={formData.phoneno}
                  onChange={handleChange}
                  required
                />
                {errors.phoneno && (
                  <small className="text-danger">{errors.phoneno}</small>
                )}
              </div>
              <div className="mb-2">
                <label>Password:</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="input-group-text bg-white"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye" : "bi-eye-slash"
                      }`}
                    ></i>
                  </span>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">
                Sign Up
              </button>
              <p className="text-center mt-2">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
