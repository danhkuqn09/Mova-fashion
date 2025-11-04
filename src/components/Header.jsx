import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header({ onCartClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <a href="/"><span>MOVACLOTHES</span></a>
        <img src="/Image/LogoHome.png" alt="MovaClothes Logo" />
      </div>

      <nav className="nav">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/shop">Cửa hàng</Link></li>
        <li><Link to="/blog">Giới Thiệu</Link></li>
        <li><Link to="/contact">Liên Hệ</Link></li>
      </nav>

      <div className="icons" ref={userMenuRef}>
        <div className="user-icon-container" style={{ position: "relative" }}>
          <i
            className="fas fa-user"
            onClick={() => setShowUserMenu((prev) => !prev)}
            style={{ cursor: "pointer" }}
          ></i>

          {/* Dropdown luôn tồn tại, chỉ ẩn bằng CSS */}
          <div className={`user-dropdown ${showUserMenu ? "show" : ""}`}>
            <Link to="/login" className="dropdown-item">Đăng nhập</Link>
            <Link to="/register" className="dropdown-item">Đăng ký</Link>
          </div>
        </div>

        <i className="fas fa-search"></i>
        <i className="fas fa-heart"></i>
        <i
          className="fas fa-shopping-cart"
          onClick={onCartClick}
          style={{ cursor: "pointer" }}
        ></i>
      </div>
    </header>
  );
}

export default Header;
