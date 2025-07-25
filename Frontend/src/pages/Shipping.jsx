import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShippingFast, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import axiosInstance from "../../axiosInterceptor";

const PINCODE_API = "https://api.postalpincode.in/pincode";

const Shipping = ({ setShippingInfo }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [savedAddress, setSavedAddress] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalPrice } = location.state || {};

  // Get latest shipping address from previous order
  useEffect(() => {
    const fetchLatestShipping = async () => {
      try {
        const res = await axiosInstance.get("/api/order/latest-shipping");
        const info = res.data.shippingInfo;
        if (info?.address && info.city && info.pincode) {
          setSavedAddress(info);
        }
      } catch (err) {
        console.warn("No previous shipping info found:", err.message);
      }
    };
    fetchLatestShipping();
  }, []);

  const validateField = (field, value) => {
    let message = "";

    switch (field) {
      case "address":
        if (value.trim().length < 5) message = "Address must be at least 5 characters";
        break;
      case "city":
        if (!/^[A-Za-z\s]+$/.test(value.trim())) message = "City must contain only letters";
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) message = "Pincode must be exactly 6 digits";
        break;
      case "country":
        if (!/^[A-Za-z\s]+$/.test(value.trim())) message = "Country must contain only letters";
        break;
      case "phone":
        if (!/^[6-9]\d{9}$/.test(value)) message = "Phone must be exactly 10 digits";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

  const handlePincodeChange = async (value) => {
    setPincode(value);
    validateField("pincode", value);

    if (/^\d{6}$/.test(value)) {
      try {
        const res = await fetch(`${PINCODE_API}/${value}`);
        const data = await res.json();
            if (data[0]?.Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District || "");
          setCountry(postOffice.Country || "India");
          setErrors((prev) => ({ ...prev, pincode: "" }));
        } else {
          setErrors((prev) => ({ ...prev, pincode: "Invalid Pincode" }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, pincode: "Pincode validation failed" }));
      }
    }
  };

  const handleContinue = () => {
    const fields = { address, city, pincode, country, phone };
    let isValid = true;

    Object.entries(fields).forEach(([field, value]) => {
      const valid = validateField(field, value);
      if (!valid) isValid = false;
    });

    if (!isValid) return;

    const shipping = { address, city, pincode, country, phone };
    setShippingInfo(shipping);
    navigate("/confirm", {
      state: { cartItems, totalPrice, shippingInfo: shipping },
    });
  };
  const handleDeliverToSaved = () => {
    setShippingInfo(savedAddress);
    navigate("/confirm", {
      state: { cartItems, totalPrice, shippingInfo: savedAddress },
    });
  };

  return (
    <div className="container mt-4">
      {/* Progress bar */}
      <div className="d-flex justify-content-center align-items-center mb-5">
        <div className="text-center me-3">
          <FaShippingFast size={30} className="text-primary" />
          <p className="mb-0 fw-bold text-primary">Shipping</p>
        </div>
        <div style={{ width: 300, height: 3, backgroundColor: "gray" }}></div>
        <div className="text-center me-3">
          <FaCheckCircle size={30} className="text-secondary" />
          <p className="mb-0">Confirm</p>
        </div>
        <div style={{ width: 300, height: 3, backgroundColor: "gray" }}></div>
        <div className="text-center">
          <FaCreditCard size={30} className="text-secondary" />
          <p className="mb-0">Payment</p>
        </div>
      </div>

      {/* Form and Saved Address Side-by-Side */}
      <div className="row justify-content-center">
        {/* Saved Address */}
        {savedAddress && (
          <div className="col-md-4 mb-4">
            <div className="card border-success shadow rounded-4 p-3">
              <h5 className="text-success text-center mb-3">Saved Address</h5>
              <p><strong>Address:</strong> {savedAddress.address}</p>
              <p><strong>City:</strong> {savedAddress.city}</p>
              <p><strong>Pincode:</strong> {savedAddress.pincode}</p>
              <p><strong>Phone:</strong> {savedAddress.phone}</p>
              <button className="btn btn-outline-success w-100 mt-2" onClick={handleDeliverToSaved}>
                Deliver Here
              </button>
            </div>
          </div>
        )}

        {/* New Address Form */}
        <div className="col-md-6">
          <div className="card p-4 shadow border-0 rounded-4">
            <h4 className="text-center mb-4">Enter New Shipping Address</h4>

            <div className="mb-3">
              <label>Address</label>
              <textarea
                className="form-control"
                rows="2"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  validateField("address", e.target.value);
                }}
              />
              {errors.address && <small className="text-danger">{errors.address}</small>}
            </div>

            <div className="mb-3">
              <label>Pincode</label>
              <input
                type="text"
                className="form-control"
                value={pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
              />
              {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
            </div>

            <div className="mb-3">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  validateField("city", e.target.value);
                }}
              />
              {errors.city && <small className="text-danger">{errors.city}</small>}
            </div>

            <div className="mb-3">
              <label>Country</label>
              <input
                type="text"
                className="form-control"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  validateField("country", e.target.value);
                }}
              />
              {errors.country && <small className="text-danger">{errors.country}</small>}
            </div>

            <div className="mb-3">
              <label>Phone</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  validateField("phone", e.target.value);
                }}
              />
              {errors.phone && <small className="text-danger">{errors.phone}</small>}
            </div>

            <button className="btn btn-primary w-100" onClick={handleContinue}>
              Use This Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
