import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1 */}
        <div className="footer-column">
          <h2 className="footer-logo">MOVACLOTHES</h2>
        </div>

        {/* Cột 2 */}
        <div className="footer-column">
          <h4>Links</h4>
          <ul>
            <li><a href="/">Trang Chủ</a></li>
            <li><a href="/shop">Cửa Hàng</a></li>
            <li><a href="/blog">Giới Thiệu</a></li>
            <li><a href="#">Liên Hệ</a></li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div className="footer-column">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Phương Thức Thanh Toán</a></li>
            <li><a href="#">Đổi Trả</a></li>
            <li><a href="#">Chính Sách Bảo Mật</a></li>
          </ul>
        </div>

        {/* Cột 4 */}
        <div className="footer-column newsletter">
          <h4>Newsletter</h4>
          <div className="newsletter-form">
            <input type="email" placeholder="Nhập Email Của Bạn" />
            <button>ĐĂNG KÝ</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MOVACLOTHES. All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
