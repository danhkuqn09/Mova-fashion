// import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import Product from "./components/Product/Product";
import Shop from "./components/Shop/shop";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Order from "./components/Order/Order";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import New from "./components/New/New"
import MomoCallbackPage from "./components/Payment/MomoCallbackPage"
import Contact from "./components/contact/Contact";
import About from "./components/About/About"; 


// Auth Forms
import Register from "./components/Auth/RegisterForm";
import Login from "./components/Auth/LoginForm";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ChangePassword from "./components/Auth/ChangePassword";
import LoginSuccess from "./components/Auth/LoginSuccess";
import Dashboard from "./components/Admin/Page/Dashboard";
import Users from "./components/Admin/Page/Users";
import Products from "./components/Admin/Page/Product";
import Categories from "./components/Admin/Page/Categories";
import Orders from "./components/Admin/Page/Order";
import Comments from "./components/Admin/Page/Comment";
import Voucher from "./components/Admin/Page/Voucher";
import News from "./components/Admin/Page/News";
import MyNews from "./components/New/MyNew";
import OrderDetail from "./components/Order/OrderDetail";
import UserProfileFull from "./components/UserProfile/UserProfile"
import Review from "./components/Admin/Page/Review";
import AddProduct from "./components/Admin/Page/AddProduct";
import AddVoucher from "./components/Admin/Page/AddVoucher";
import AddCategories from "./components/Admin/Page/AddCategories";
import NewDetail from "./components/Admin/Page/NewDetail";
import EditProduct from "./components/Admin/Page/EditProduct";
import ReviewDetail from "./components/Admin/Page/ReviewDetail";
import OrderDetailAdmin from "./components/Admin/Page/OrderDetail";
import EditCategory from "./components/Admin/Page/EditCategories";
import UserDetail from "./components/Admin/Page/UserDetail";
import CommentDetail from "./components/Admin/Page/CommentDetail";
import AdminLayout from "./components/Admin/AdminLayout";
import ProductView from "./components/Admin/Page/ProductView";
import EditVoucher from "./components/Admin/Page/EditVoucher";
// CSS & Libraries
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Header />}

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/news" element={<New />} />
        <Route path="/my-news" element={<MyNews />} />
        <Route path="admin/reviews" element={< Review />}></Route>

        {/* ROUTE LIÊN HỆ VÀ THÔNG TIN VỀ CHÚNG TÔI */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />


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
        <Route path="/payment/callback" element={<MomoCallbackPage />} />
        <Route path="/user" element={<UserProfileFull />}></Route>

        {/* Admin - Wrap tất cả routes admin trong AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategories />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetailAdmin />} />
          <Route path="comments" element={<Comments />} />
          <Route path="comments/:id" element={<CommentDetail />} />
          <Route path="voucher" element={<Voucher />} />
          <Route path="voucher/add" element={<AddVoucher />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewDetail />} />
          <Route path="reviews" element={<Review />} />
          <Route path="reviews/:id" element={<ReviewDetail />} />
          <Route path="products/view/:id" element={<ProductView />} />
          <Route path="voucher/edit/:id" element={<EditVoucher />} />
        </Route>

        <Route path="/order/:id" element={<OrderDetail />} />

      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;