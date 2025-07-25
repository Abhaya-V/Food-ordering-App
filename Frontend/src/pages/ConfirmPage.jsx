import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShippingFast, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import axios from "axios";
import axiosInstance from "../../axiosInterceptor";

// Haversine formula to calculate distance in km
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const ConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    cartItems,
    totalPrice,
    shippingInfo: initialShipping,
  } = location.state || {};
  const [shippingInfo, setShippingInfo] = useState(initialShipping || {});
  const [isEditing, setIsEditing] = useState(false);
  const [remark, setRemark] = useState("");
  const [distance, setDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(40);
  const [cityMismatch, setCityMismatch] = useState(false);
  const [discount, setDiscount] = useState(0);

  const finalAmount = totalPrice + deliveryFee - discount;

  useEffect(() => {
    const fetchDistance = async () => {
      if (!shippingInfo?.address || !shippingInfo?.city) return;
      try {
        const food = cartItems?.[0];
        const restaurant = food?.foodId?.restaurant;
        const resLat = restaurant?.latitude || restaurant?.location?.latitude;
        const resLon = restaurant?.longitude || restaurant?.location?.longitude;
        const resCity = restaurant?.city || restaurant?.location?.city;

        if (!resLat || !resLon || !resCity) {
          console.warn(" Missing restaurant location info");
          return;
        }

        const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}`;
        const geoRes = await axios.get(
          `http://localhost:8000/api/geocode/coords?address=${encodeURIComponent(
            fullAddress
          )}`
        );

        const userLat = geoRes.data.latitude;
        const userLon = geoRes.data.longitude;

        const dist = haversineDistance(userLat, userLon, resLat, resLon);
        setDistance(dist);

        const userCity = shippingInfo.city?.toLowerCase().trim();
        const restCity = resCity?.toLowerCase().trim();

        if (userCity !== restCity) {
          setCityMismatch(true);
        } else {
          setCityMismatch(false);
        }

        setDeliveryFee(dist <= 5 ? 0 : 40);
      } catch (err) {
        console.error(
          "Failed to fetch coordinates or calculate distance:",
          err.message
        );
      }
    };

    fetchDistance();
  }, [shippingInfo]);

  useEffect(() => {
    if (totalPrice >= 2000) {
      const discountAmount = totalPrice * 0.2; // 20%
      setDiscount(discountAmount);
    } else {
      setDiscount(0);
    }
  }, [totalPrice]);

  const validateForm = () => {
    const { address, city, pincode, country, phone } = shippingInfo;
    let isValid = true;
    if (!address || address.trim().length < 5) isValid = false;
    if (!/^[A-Za-z\s]+$/.test(city || "")) isValid = false;
    if (!/^\d{6}$/.test(pincode || "")) isValid = false;
    if (!/^[A-Za-z\s]+$/.test(country || "")) isValid = false;
    if (!/^\d{10}$/.test(phone || "")) isValid = false;

    if (!isValid) {
      alert("Invalid shipping information. Please check and try again.");
    }
    return isValid;
  };

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleProceedToPayment = () => {
    if (isEditing) {
      alert("Please save your shipping info before proceeding.");
      return;
    }
    if (!validateForm()) return;
    if (cityMismatch) {
      alert("Delivery not available to a different city from the restaurant.");
      return;
    }

    navigate("/payment", {
      state: {
        cartItems,
        shippingInfo,
        finalAmount,
        remark,
      },
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center align-items-center mb-5">
        <div className="text-center me-3">
          <FaShippingFast size={30} className="text-primary" />
          <p className="mb-0 fw-bold text-primary">Shipping</p>
        </div>
        <div style={{ width: 300, height: 3, backgroundColor: "gray" }}></div>
        <div className="text-center me-3">
          <FaCheckCircle size={30} className="text-primary" />
          <p className="mb-0 fw-bold text-primary">Confirm</p>
        </div>
        <div style={{ width: 300, height: 3, backgroundColor: "gray" }}></div>
        <div className="text-center">
          <FaCreditCard size={30} className="text-secondary" />
          <p className="mb-0">Payment</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 mb-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-semibold">Shipping Information</h5>
              {!isEditing && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="row">
                {["address", "city", "pincode", "country", "phone"].map(
                  (field) => (
                    <div className="col-md-6 mb-2" key={field}>
                      <label className="form-label text-capitalize">
                        {field}
                      </label>
                      <input
                        className="form-control"
                        name={field}
                        value={shippingInfo[field] || ""}
                        onChange={handleChange}
                      />
                    </div>
                  )
                )}
                <div className="text-end">
                  <button className="btn btn-success mt-2" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Address:</strong> {shippingInfo?.address}
                </p>
                <p>
                  <strong>City:</strong> {shippingInfo?.city}
                </p>
                <p>
                  <strong>Pincode:</strong>{" "}
                  <span>{shippingInfo?.pincode}</span>
                </p>
                <p>
                  <strong>Country:</strong> {shippingInfo?.country}
                </p>
                <p>
                  <strong>Phone:</strong> {shippingInfo?.phone}
                </p>
              </>
            )}
          </div>

          <div className="card p-3 mb-4 shadow-sm">
            <h5 className="mb-3 fw-semibold">Items in Your Cart</h5>
            {cartItems?.map((item) => (
              <div
                key={item._id}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <div>
                  <strong>{item.foodId.name}</strong> x {item.quantity}
                </div>
                <div>₹{item.foodId.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="card p-3 shadow-sm">
            <label className="form-label fw-semibold">
              Add Remark <small className="text-muted">(Optional)</small>
            </label>
            <textarea
              className="form-control"
              placeholder="E.g., No onions in burger, please deliver after 8 PM"
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card p-4 shadow-sm sticky-top"
            style={{ top: "100px" }}
          >
            <h5 className="mb-3 fw-semibold">Price Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span> 20% Offer for above ₹2000 </span>
                <span>₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-2">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold mb-4">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleProceedToPayment}
              disabled={isEditing || cityMismatch}
            >
              Proceed to Payment
            </button>
            {isEditing && (
              <p className="text-danger mt-2 text-center">
                Please save your shipping info before continuing.
              </p>
            )}
            {cityMismatch && (
              <p className="text-danger mt-2 text-center">
                Delivery only within the restaurant's city is allowed.
              </p>
            )}
            {distance !== null && (
              <p className="text-success text-center mt-2">
                Distance: {distance.toFixed(2)} km
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;
