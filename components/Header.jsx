import React from 'react';
import '../index.css'; // Để import styles
import {
  FiUser,
  FiSearch,
  FiHeart,
  FiShoppingBag
} from 'react-icons/fi';

// Giả sử logo là một thẻ span đơn giản
const Header = () => {
  return (
    <header className="header">
      <div className="logo">MOVA<span>CLOTHES.</span></div>
      <nav className="nav-links">
        <a href="#trangchu">Trang Chủ</a>
        <a href="#cuahang">Cửa Hàng</a>
        <a href="#gioithieu">Giới Thiệu</a>
        <a href="#lienhe">Liên Hệ</a>
      </nav>
      <div className="user-actions">
        <span className="icon"><FiUser size={20} /></span>
        <span className="icon"><FiHeart size={20} /></span>
        <span className="icon"><FiSearch size={20} /></span>
        <span className="icon"><FiShoppingBag size={20} /></span>
      </div>
    </header>
  );
};

export default Header;