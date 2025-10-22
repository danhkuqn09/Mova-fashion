import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { FiUser, FiSearch, FiHeart, FiShoppingBag } from 'react-icons/fi';
import './index.css';
import LoginForm from './components/LoginForm';
import CartPage from './components/CartPage';
import RegisterForm from './components/RegisterForm';

// --- Component Giả Lập/Cơ Sở ---

// 1. Header Component
const Header = () => (
    <header className="header">
        <div className="logo">
            <Link to="/">MOVA<span style={{fontWeight: 'normal', fontSize: '14px', marginLeft: '5px'}}>CLOTHES</span></Link>
        </div>
        <nav className="nav-links">
            <Link to="/">Trang Chủ</Link>
            <Link to="/store">Cửa Hàng</Link>
            <Link to="/about">Giới Thiệu</Link>
            <Link to="/contact">Liên Hệ</Link>
        </nav>
        <div className="user-actions">
            <Link to="/login" className="icon"><FiUser size={20} /></Link>
            <span className="icon"><FiSearch size={20} /></span>
            <span className="icon"><FiHeart size={20} /></span>
            <Link to="/cart" className="icon"><FiShoppingBag size={20} /></Link>
        </div>
    </header>
);

// 2. Footer Component
const Footer = () => (
    <footer className="footer">
        <div className="footer-top">
            <div className="footer-logo">
                MOVA<span style={{fontWeight: 'normal', fontSize: '14px', marginLeft: '3px'}}>CLOTHES.</span>
            </div>
            <div className="footer-section">
                <h4>Links</h4>
                <ul>
                    <li><Link to="/">Trang Chủ</Link></li>
                    <li><Link to="/store">Cửa Hàng</Link></li>
                    <li><Link to="/about">Giới Thiệu</Link></li>
                    <li><Link to="/contact">Liên Hệ</Link></li>
                </ul>
            </div>
            <div className="footer-section">
                <h4>Help</h4>
                <ul>
                    <li><a href="#payment">Payment Options</a></li>
                    <li><a href="#returns">Returns</a></li>
                    <li><a href="#privacy">Privacy Policies</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h4>Newsletter</h4>
                <div className="newsletter-form">
                    <input type="email" placeholder="Enter Your Email Address" />
                    <button>SUBSCRIBE</button>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            2025 MOVECLOTHES. All rights reserved
        </div>
    </footer>
);


// 3. HomePage Component
const HomePage = () => (
  <>
    <Header />
    <main className="main-content-wrapper home-page-content" style={{ backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', padding: '150px 50px', flexGrow: 1, color: '#333' }}>
        Trang Chủ MOVA CLOTHES
      </h1>
    </main>
    <Footer />
  </>
);

// --- Component Chính Của Ứng Dụng ---

function App() {
  return (
    // Toàn bộ ứng dụng được bọc trong Router
    <Router> 
      <div className="app-layout">
        <Routes>
          
          {/* 1. Trang Chủ (Sử dụng HomePage đã có Header/Footer) */}
          <Route path="/" element={<HomePage />} />
          
          {/* 2. Trang Đăng Nhập (Sử dụng LoginForm) */}
          <Route path="/login" element={
            <>
              <Header />
              <main><LoginForm /></main>
              <Footer />
            </>
          } />

          {/* 3. Trang Đăng Ký (Giả lập) */}
          <Route path="/register" element={
            <>
              <Header />
              <main><RegisterForm /></main>
              <Footer />
            </>
          } />

          {/* 4. Trang Giỏ Hàng/Thanh Toán (Sử dụng CartPage) */}
          <Route path="/cart" element={
            <>
              <Header />
              <main><CartPage /></main>
              <Footer />
            </>
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
