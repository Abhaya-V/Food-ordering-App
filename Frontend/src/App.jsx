import React from "react";
import PublicNavbar from "./components/PublicNavbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Foodlist from "./pages/Foodlist";
import Verifyemail from "./pages/Verifyemail";
import PrivateNavbar from "./components/PrivateNavbar";
import { useState, useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import Verifypassword from "./pages/Verifypassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import RestaurantMenu from "./pages/RestaurantMenu";
import OrderSuccess from "./pages/OrderSuccess";
import ConfirmPage from "./pages/ConfirmPage";
import PaymentPage from "./pages/PaymentPage";
import MyOrder from "./pages/MyOrder";
import FoodDetails from "./pages/FoodDetails";
import axiosInstance from "../axiosInterceptor";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { useLocation } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import SellerSignup from "./pages/Seller/SellerSignup";
import SellerLogin from "./pages/Seller/SellerLogin";
import SellerNavbar from "./components/SellerNavbar";
import SellerFoods from "./pages/Seller/SellerFoods";
import AddFood from "./pages/Seller/AddFood";
import SellerLayout from "./components/SellerLayout";
import SellerOrders from "./pages/Seller/SellerOrders";
import SellerDashboard from "./pages/Seller/SellerDashboard";
import EditSellerProfile from "./pages/Seller/updateSellerProfile";
import EditFood from "./pages/Seller/EditFood";
import AdminLayout from "./components/AdminLayout";
import AdminSellerManagement from "./pages/Admin/AdminSellerManagement";
import AdminRestaurantManagement from "./pages/Admin/AdminRestaurantManagement";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminChangePassword from "./pages/Admin/AdminChangePassword";
import AdminOrderManagement from "./pages/Admin/AdminOrderManagement";
import RevenueDetails from "./pages/Admin/RevenueDetails";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [shippingInfo, setShippingInfo] = useState(null);

  useEffect(() => {
  const token = sessionStorage.getItem("token");
  setIsLoggedIn(!!token);

  if (token) {
    fetchCartCount();
  }
}, []);

   const fetchCartCount = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:8000/api/cart/get/user");
      setCartCount(res.data.length);
    } catch (err) {
      console.error("Cart fetch failed", err);
    }
  };

  
const location = useLocation();
const isAdminRoute = location.pathname.startsWith("/admin");
const isAdminLogin = location.pathname === "/admin/login" 
const isSellerLoginOrSignup =
  location.pathname === "/seller/login" || location.pathname === "/seller/signup";
const isSellerRoute = location.pathname.startsWith("/seller");
  return (
    <>
{isAdminRoute ? (
  isAdminLogin ? <AdminNavbar/> : null
) : isSellerRoute ? (
  isSellerLoginOrSignup ? <SellerNavbar /> :null 
) : isLoggedIn ? (
  <PrivateNavbar setIsLoggedIn={setIsLoggedIn} cartCount={cartCount} />
) : (
  <PublicNavbar />
)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/foods"
          element={
            <PrivateRoute>
              <Foodlist />
            </PrivateRoute>
          }
        />
        <Route path="/verify" element={<Verifyemail />} />
        <Route path="/forgot-password" element={<Verifypassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart setCartCount={setCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipping"
          element={
            <PrivateRoute>
              <Shipping setShippingInfo={setShippingInfo} />
            </PrivateRoute>
          }
        />
        <Route
          path="/confirm"
          element={
            <PrivateRoute>
              <ConfirmPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentPage setCartCount={setCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            <PrivateRoute>
              <RestaurantMenu />
            </PrivateRoute>
          }
        />
        <Route
          path="/ordersuccess"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/myorder"
          element={
            <PrivateRoute>
              <MyOrder />
            </PrivateRoute>
          }
        />
        <Route path="/food/:id" element={<FoodDetails />} />

        <Route path="/admin/login" element={<AdminLogin/>} />
        
       
       <Route path="/admin" element={<AdminLayout/>}>
         <Route path="/admin/change-password" element={<AdminChangePassword/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sellers" element={<AdminSellerManagement/>} />
        <Route path="/admin/restaurants" element={<AdminRestaurantManagement />} />
        <Route path="/admin/users" element={<AdminUserManagement/>}/>
        <Route path="/admin/orders" element={<AdminOrderManagement/>}/>
        <Route path="/admin/revenue" element={<RevenueDetails/>}/>
        </Route>
        
     <Route path="/seller/signup" element={<SellerSignup/>} />
        <Route path="/seller/login" element={<SellerLogin/>} />
        <Route path="/seller" element={<SellerLayout/>}>
      
         <Route path="/seller/dashboard" element={<SellerDashboard/>} />
        <Route path="/seller/viewfood" element={<SellerFoods />} />
        <Route path="/seller/addfood" element={<AddFood />} />
        <Route path="/seller/editfood/:id" element={<EditFood />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/profile" element={<EditSellerProfile/>} />
        </Route>


      </Routes>
    </>
  );
};

export default App;
