import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
// import logo from "/public/Image/LogoHome.png";  

function Header() {
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
        <i className="fas fa-shopping-cart"></i>
      </div>
    </header>
  );
}

export default Header;
