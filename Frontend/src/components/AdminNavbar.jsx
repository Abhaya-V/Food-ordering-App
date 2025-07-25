import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        
        <Link className="navbar-brand d-flex align-items-center" to="/admin/dashboard">
          <img
            src="/logo.png"
            alt="Admin"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span>Admin Panel</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav ms-auto gap-3">
            {!isLoginPage && (
              <>
                <li className="nav-item">
                  <Link className="nav-link btn active m-1" to="/admin/dashboard">
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

export default AdminNavbar;
