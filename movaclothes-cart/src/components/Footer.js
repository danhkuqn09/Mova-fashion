import React from "react";
import "../App.css";

const Footer = () => {
  return (
    <footer className="footer-minimal">
      <div className="footer-top">
        <div className="footer-col">
          <h2 className="footer-logo">MOVACLOTHES.</h2>
        </div>

        <div className="footer-col">
          <h4>Links</h4>
          <ul>
            <li><a href="/">Trang Chủ</a></li>
            <li><a href="/">Cửa Hàng</a></li>
            <li><a href="/">Giới Thiệu</a></li>
            <li><a href="/">Liên Hệ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="/">Payment Options</a></li>
            <li><a href="/">Returns</a></li>
            <li><a href="/">Privacy Policies</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Newsletter</h4>
          <div className="newsletter">
            <input
              type="email"
              placeholder="Enter Your Email Address"
              className="newsletter-input"
            />
            <button className="newsletter-btn">SUBSCRIBE</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>2025 MOVACLOTHES. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
