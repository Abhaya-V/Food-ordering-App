import { NavLink } from "react-router-dom";

const SellerSidebar = () => {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ height: "100vh", width: "220px", position: "fixed", top: "56px" }}
    >
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/seller/viewfood" className="nav-link text-white">
            View Food 
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/seller/addfood" className="nav-link text-white">
            Add Food
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/seller/orders" className="nav-link text-white">
            View Orders
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/seller/profile" className="nav-link text-white">
            Edit Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SellerSidebar;
