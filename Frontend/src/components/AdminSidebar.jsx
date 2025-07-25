import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-dark text-white p-3 " style={{ width: "250px",height: "100vh",position: "fixed", top: "56px" }}>
      <ul className="nav flex-column ">
        <li>
          <Link to="/admin/sellers" className={`nav-link ${pathname.includes("/sellers") ? "text-primary" : "text-white"}`}>
             Seller Details
          </Link>
        </li>
        <li>
          <Link to="/admin/restaurants" className={`nav-link ${pathname.includes("/restaurants") ? "text-primary" : "text-white"}`}>
          Restaurant Details
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className={`nav-link ${pathname.includes("/users") ? "text-primary" : "text-white"}`}>
            User Details
          </Link>
        </li>
        <li>
  <Link to="/admin/orders" className={`nav-link ${pathname.includes("/orders") ? "text-primary" : "text-white"}`}>
    Order Details
  </Link>
</li>
 <li>
  <Link to="/admin/revenue" className={`nav-link ${pathname.includes("/revenue") ? "text-primary" : "text-white"}`}>
    Revenue Details
  </Link>
</li>
      </ul>
    </div>
  );
};

export default AdminSidebar;


