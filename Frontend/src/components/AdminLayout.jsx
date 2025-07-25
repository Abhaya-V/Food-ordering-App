import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="p-4" style={{  marginLeft: "250px", 
            width: "100%",}}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;


