import React from 'react';
import { Link } from 'react-router-dom';
import { IoCartOutline } from "react-icons/io5";

const PublicNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo.png"
            alt="Foodie"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span>Foodie</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3">
            <li className="nav-item">
              <Link className="nav-link btn active m-1" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn m-1" to="/cart">
                <IoCartOutline size={22} />
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="btn btn-success dropdown-toggle m-1"
                id="loginDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Login
              </Link>
              <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                <li><Link className="dropdown-item btn btn-success" to="/login">Customer Login</Link></li>
                <li><Link className="dropdown-item btn btn-success" to="/admin/login">Admin Login</Link></li>
                <li><Link className="dropdown-item btn btn-success" to="/seller/login">Seller Login</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-success m-1" to="/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
