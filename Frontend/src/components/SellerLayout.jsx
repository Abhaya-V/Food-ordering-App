import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = () => {
  return (
    <div>
      <SellerNavbar />
      <div className="d-flex">
          <SellerSidebar />
        <div style={{ marginLeft:"220px" , padding: "20px", width: "100%", transition: "margin 0.3s" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
