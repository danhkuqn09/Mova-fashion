import React, { useState } from "react"; // 1. Import thêm useState
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Banner from "./components/Banner";
import Product from "./components/Product";
import Footer from "./components/Footer";
import Shop from "./components/Shop/shop";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Order from "./components/Order/Order";
import CartSlide from "./components/CartSlide/CartSlide"; // 2. Import CartSlide (sửa lại đường dẫn nếu cần)
import Register from "./components/RegisterForm";
import Login from "./components/LoginForm";
import Blog from "./components/Blog/Blog";
import BlogDetail from "./components/Blog/BlogDetail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";
// CSS
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  // 3. Tạo state và các hàm điều khiển CartSlide
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  return (
    <>
      <Header onCartClick={handleOpenCart} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Product />
            </>
          }
        />
        <Route path="/shop" element={<Shop />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="/order" element={<Order />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
      {/* 8. Đặt CartSlide ở đây, bên ngoài Routes */}
      <CartSlide isOpen={isCartOpen} onClose={handleCloseCart} />
            <Footer />
    </>
  );
}

export default App;