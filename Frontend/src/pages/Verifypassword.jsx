import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verifypassword = () => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  // form validation
  const validateEmail = () => {
    let isValid = true
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }
  const validateOtp = () => {
    let isValid = true
    const newErrors = {}
    if (!otp || otp.length !== 4) {
      newErrors.otp = "OTP must be 4 digits"
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }

  // otpSend => false
  const handleSendOtp = (e) => {
    e.preventDefault()
    // validation
    if (!validateEmail()) return
    axios
      .post("http://localhost:8000/api/users/forgot-password", { email })
      .then((res) => {
        alert(res.data.message)
        setOtpSent(true)
      })
      .catch((error) => {
        console.log(error)
        alert("Error sending OTP")
      })
  }

  // otpSend => true
  const handleVerifyOtp = (e) => {
    e.preventDefault()
    // validation
    if (!validateOtp()) return
    axios
      .post("http://localhost:8000/api/users/verify-reset-otp", { email, otp })
      .then((res) => {
        alert(res.data.message)
        navigate("/reset-password", { state: { email } })
      })
      .catch((error) => {
        console.log(error)
        alert("OTP verification failed")
      })
  }
  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ height: "89.3vh", overflow: "hidden" }}>
        <div className="col-md-6 d-none d-md-block">
          <img src="banner.jpg" alt="image" className="w-100 h-100" style={{ objectFit: "cover" }} />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-secondary">
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
              className="shadow p-4 border bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-4">Reset Password</h2>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              {otpSent && (
                <div className="mb-3">
                  <label>Enter OTP sent to your email:</label>
                  <input
                    type="text"
                    placeholder="OTP"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  {errors.otp && <small className="text-danger">{errors.otp}</small>}
                </div>
              )}
              <button type="submit" className="btn btn-success w-100 mt-2">
                {otpSent ? "Verify OTP" : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verifypassword;
