import React, { useState } from "react"; // 1. Import thêm useState
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Banner from "./components/Banner";
import Product from "./components/Product";
import Footer from "./components/Footer";
import Shop from "./components/Shop/shop";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Cart from "./components/Cart/Cart";
import CartSlide from "./components/CartSlide/CartSlide"; // 2. Import CartSlide (sửa lại đường dẫn nếu cần)
import Register from "./components/RegisterForm";
import Login from "./components/LoginForm";
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
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header onCartClick={handleOpenCart} />
              <Banner />
              <Product />
              <Footer />
            </>
          }
        />
        <Route path="/shop" element={<Shop />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* 8. Đặt CartSlide ở đây, bên ngoài Routes */}
      <CartSlide isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}

export default App;