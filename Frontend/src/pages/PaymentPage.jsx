import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInterceptor";
import { FaShippingFast, FaCheckCircle, FaCreditCard } from "react-icons/fa";

const PaymentPage = ({ setCartCount }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartItems, shippingInfo, finalAmount,remark } = location.state || {}
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const triggerPayment = async () => {
      try {
        // taking key from backend
         const key = await axiosInstance.get("/api/payment/get-key")
        // taking finalamount
        const res = await axiosInstance.post("/api/payment/create-order", {
          amount: finalAmount,
        })

        const options = {
          key: key.data.key,
          amount: res.data.amount,
          currency: res.data.currency,
          name: "Foodie",
          description: "Order Payment",
          order_id: res.data.id,
          handler: async function (response) {
            // verify the razorpay signature
            await axiosInstance.post("/api/payment/verify", response)
            // order create
            const orderRes = await axiosInstance.post("/api/order/create", {
              cartItems: cartItems.map((item) => ({
                foodId: item.foodId._id,
                quantity: item.quantity,
              })),
              shippingInfo,
              totalAmount: finalAmount,
              remark,
            });

            const orderID = orderRes.data.order.orderId;
            // clearing cart
            await axiosInstance.post("/api/cart/clear");
            setCartCount(0);
            navigate("/ordersuccess", { state: { order_id: orderID } });
          },
          theme: { color: "#28a745" },
        }
        const rzp = new Razorpay(options);
        rzp.open();
        setLoading(false); 
      } catch (err) {
        console.error("Payment error", err);
        alert("Something went wrong during payment.");
        setLoading(false);
      }
    }
    triggerPayment();
  }, []);

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
        <FaCreditCard size={30} className="text-success" />
        <p className="mb-0 fw-bold text-success">Payment</p>
      </div>
    </div>

    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status"></div>
          <p className="fw-semibold">Redirecting to payment...</p>
        </div>
      )}
    </div>

  </div>
);

};

export default PaymentPage;
