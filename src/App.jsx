// import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import Product from "./components/Product/Product";
import Shop from "./components/Shop/shop";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Order from "./components/Order/Order";
import Cart from "./components/Cart/Cart";
import Blog from "./components/Blog/Blog";
import BlogDetail from "./components/Blog/BlogDetail";

// Auth Forms
import Register from "./components/Auth/RegisterForm";
import Login from "./components/Auth/LoginForm";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ChangePassword from "./components/Auth/ChangePassword";
import LoginSuccess from "./components/Auth/LoginSuccess";

// CSS & Libraries
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {

  return (
    <>
      <Header />

      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Product />
            </>
          }
        />

        {/* Các trang khác */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/productdetail/:id" element={<ProductDetail />} />
        <Route path="/order" element={<Order />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/cart" element={<Cart />} />

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
        <Route path="/auth/google/callback" element={<LoginSuccess />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
