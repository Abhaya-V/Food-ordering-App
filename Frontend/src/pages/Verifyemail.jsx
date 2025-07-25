import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verifyemail = () => {
  const [verificationEmail, setverificationEmail] = useState("")
  const navigate = useNavigate()

  // onsubmit
  const handleKey = (e) => {
    e.preventDefault()
    axios
      .post("https://food-ordering-app-back.vercel.app/api/users/verify", {verificationEmail })
      .then((res) => {
        alert(res.data.message)
        navigate("/login")
      })
      .catch((error) => {
        console.log(error)
        alert("Verification failed")
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
              onSubmit={handleKey}
              className="shadow p-4  border  bg-dark text-white"
              style={{ borderRadius: "40px" }}
            >
              <h2 className="text-center mb-4">Verification of Email</h2>
              <div className="mb-3">
                <label>Verification OTP:</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={verificationEmail}
                  onChange={(e) => setverificationEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verifyemail;