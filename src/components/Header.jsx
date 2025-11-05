import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header({ onCartClick }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    // [NEW] State quản lý Menu Mobile
    const [showMobileMenu, setShowMobileMenu] = useState(false); 
    
    const userMenuRef = useRef(null);
    const navRef = useRef(null); // Ref cho thanh nav mobile

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            
            // [NEW] Đóng mobile menu khi click ra ngoài
            if (navRef.current && !navRef.current.contains(event.target) && !userMenuRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    // [NEW] Hàm đóng/mở Mobile Menu
    const toggleMobileMenu = () => {
        setShowMobileMenu((prev) => !prev);
    };

    return (
        <header className="header">
            <div className="logo">
                <a href="/"><span>MOVACLOTHES</span></a>
                <img src="/Image/LogoHome.png" alt="MovaClothes Logo" />
            </div>

            {/* [CẬP NHẬT] Áp dụng class 'active' cho thanh nav */}
            <nav className={`nav ${showMobileMenu ? 'active' : ''}`} ref={navRef}>
                <li><Link to="/" onClick={() => setShowMobileMenu(false)}>Trang chủ</Link></li>
                <li><Link to="/shop" onClick={() => setShowMobileMenu(false)}>Cửa hàng</Link></li>
                <li><Link to="/blog" onClick={() => setShowMobileMenu(false)}>Giới Thiệu</Link></li>
                <li><Link to="/contact" onClick={() => setShowMobileMenu(false)}>Liên Hệ</Link></li>
            </nav>

            <div className="icons" ref={userMenuRef}>
                {/* [NEW] ICON HAMBURGER */}
                <i 
                    className="fas fa-bars menu-toggle-icon" 
                    onClick={toggleMobileMenu}
                    style={{ cursor: "pointer" }}
                ></i>
                
                {/* Icon User */}
                <div className="user-icon-container" style={{ position: "relative" }}>
                    <i
                        className="fas fa-user"
                        onClick={() => setShowUserMenu((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                    ></i>
                    {/* Dropdown luôn tồn tại, chỉ ẩn bằng CSS */}
                    <div className={`user-dropdown ${showUserMenu ? "show" : ""}`}>
                        <Link to="/login" className="dropdown-item" onClick={() => setShowUserMenu(false)}>Đăng nhập</Link>
                        <Link to="/register" className="dropdown-item" onClick={() => setShowUserMenu(false)}>Đăng ký</Link>
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