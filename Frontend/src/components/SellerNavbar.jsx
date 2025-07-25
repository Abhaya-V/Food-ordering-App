import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const SellerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/seller/login" || location.pathname === "/seller/signup";

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/seller/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/seller/dashboard">
          <img
            src="/logo.png"
            alt="Seller"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span>Seller Panel</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sellerNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="sellerNavbarNav">
          <ul className="navbar-nav ms-auto gap-3">
            {!isLoginPage && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link btn m-1 ${location.pathname === "/seller/dashboard" ? "btn-primary" : "btn-outline-light"}`}
                    to="/seller/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-danger m-1"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;
