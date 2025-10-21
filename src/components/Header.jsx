import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

// 1. Nhận 'onCartClick' từ props
function Header({ onCartClick }) { 
  return (
    <header className="header">
      <div className="logo">
        <a href="/"><span>MovoShop</span></a>
        <img src="/Image/LogoHome.png" alt="MovaClothes Logo" />
      </div>

      <nav className="nav">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/shop">Cửa hàng</Link></li>
        <li><Link to="/shop">Giới Thiệu</Link></li>
        <li><Link to="/shop">Liên Hệ</Link></li>
      </nav>

      <div className="icons">
        <i className="fas fa-user"></i>
        <i className="fas fa-search"></i>
        <i className="fas fa-heart"></i>

        {/* 2. Thêm sự kiện onClick vào icon giỏ hàng.
             Khi click, nó sẽ gọi hàm 'onCartClick' (chính là hàm 'handleOpenCart' ở App.jsx)
        */}
        <i 
          className="fas fa-shopping-cart" 
          onClick={onCartClick} 
          style={{ cursor: "pointer" }} // Thêm style để thấy đây là nút bấm
        ></i>
      </div>
    </header>
  );
}

export default Header;