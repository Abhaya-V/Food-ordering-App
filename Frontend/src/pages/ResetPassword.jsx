import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // email taking from verifypassword
  const location = useLocation()
  const email = location.state?.email
  
  const navigate = useNavigate()
  
  // form validation
  const validateForm = () => {
    let isValid = true
    const newErrors = {}
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must include 6+ characters, uppercase, lowercase, number & special char."
      isValid = false
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }

  // onSubmit
  const handleReset = (e) => {
    e.preventDefault()
    if (!email) {
      alert("Email missing. Restart the password reset process.")
      return
    }
    // validation
    if (!validateForm()) return
    axios
      .post("http://localhost:8000/api/users/reset-password", {
        email,
        newPassword: password,
      })
      .then((res) => {
        alert(res.data.message)
        navigate("/login")
      })
      .catch((error) => {
        console.log(error)
        alert("Failed to reset password")
      })
  }
  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ height: "89.3vh", overflow: "hidden" }}>
        <div className="col-md-6 d-none d-md-block">
          <img
            src="banner.jpg"
            alt="Reset Visual"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-secondary">
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <form
              onSubmit={handleReset}
              className="shadow p-4 bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-4">Reset Password</h2>
              <div className="mb-3">
                <label>New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text bg-white"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>
              <div className="mb-3">
                <label>Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text bg-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                </div>
                {errors.confirmPassword && (
                  <small className="text-danger">{errors.confirmPassword}</small>
                )}
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
