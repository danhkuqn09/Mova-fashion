import React from 'react';
import '../index.css';
import { AiOutlineGoogle } from 'react-icons/ai'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">MOVA<span>CLOTHES.</span></div>
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="#trangchu">Trang Chủ</a></li>
            <li><a href="#cuahang">Cửa Hàng</a></li>
            <li><a href="#gioithieu">Giới Thiệu</a></li>
            <li><a href="#lienhe">Liên Hệ</a></li>
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
        <div className="footer-section newsletter">
          <h4>Newsletter</h4>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter Your Email Address" />
            <button>SUBSCRIBE</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>2025 MOVECLOTHES. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;