import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  // form validation
  const validateForm = () => {
    let isValid = true
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must include 6+ characters, uppercase, lowercase, number & special char"
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }
  const handleLogin = (e) => {
    e.preventDefault()
    // validation
    if (!validateForm()) return
    axios
      .post("http://localhost:8000/api/users/login", { email, password })
      .then((res) => {
        console.log("Login Successfull")
        // token
        sessionStorage.setItem("token", res.data.token)
        setIsLoggedIn(true)
        navigate("/")
      })
      .catch((error) => {
         const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
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
              onSubmit={handleLogin}
              className="shadow p-4 border bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-4">Login to Foodie</h2>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
              <div className="mb-1">
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
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>
              <div className="text-center mb-1 ">
                <Link to="/forgot-password" className="text-info text-decoration-none">
                  Forgot Password ?
                </Link>
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">
                Login
              </button>
              <p className="text-center mt-2">
                New User? <Link to="/signup">Signup</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
