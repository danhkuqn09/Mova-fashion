import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import Product from "./components/Product/Product";
import Shop from "./components/Shop/shop";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Order from "./components/Order/Order";
import CartSlide from "./components/CartSlide/CartSlide";
import Blog from "./components/Blog/Blog";
import BlogDetail from "./components/Blog/BlogDetail";

// Auth Forms
import Register from "./components/Auth/RegisterForm";
import Login from "./components/Auth/LoginForm";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ChangePassword from "./components/Auth/ChangePassword";

// CSS & Libraries
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  // Quản lý mở/đóng giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  return (
    <>
      <Header onCartClick={handleOpenCart} />

      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Product />
              <Footer />
            </>
          }
        />

        {/* Các trang khác */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/productdetail/:id" element={<ProductDetail />} />
        <Route path="/order" element={<Order />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/change-password"
          element={
            localStorage.getItem("token") ? (
              <ChangePassword />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {/* Slide giỏ hàng (CartSlide) */}
      <CartSlide isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}

export default App;
