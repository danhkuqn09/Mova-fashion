import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer bg-light pt-5">
      <div className="container">
        <div className="row g-4">
          {/* Cột 1 - Logo & About */}
          <div className="col-md-3">
            <h2 className="footer-logo fw-bold mb-3" style={{ color: '#b88e2f' }}>MOVACLOTHES</h2>
            <p className="text-secondary small">
              Thời trang cao cấp dành cho người Việt. Phong cách - Đẳng cấp - Tinh tế.
            </p>
            <div className="social-icons mt-3">
              <a href="#" className="text-dark me-3"><i className="fab fa-facebook fa-lg"></i></a>
              <a href="#" className="text-dark me-3"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" className="text-dark me-3"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-youtube fa-lg"></i></a>
            </div>
          </div>

          {/* Cột 2 - Liên kết */}
          <div className="col-md-3">
            <h5 className="mb-3 fw-bold text-dark">Liên kết</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-secondary text-decoration-none footer-link">Trang Chủ</a></li>
              <li className="mb-2"><a href="/shop" className="text-secondary text-decoration-none footer-link">Cửa Hàng</a></li>
              <li className="mb-2"><a href="/news" className="text-secondary text-decoration-none footer-link">Giới Thiệu</a></li>
              <li className="mb-2"><a href="/contact" className="text-secondary text-decoration-none footer-link">Liên Hệ</a></li>
            </ul>
          </div>

          {/* Cột 3 - Trợ giúp */}
          <div className="col-md-3">
            <h5 className="mb-3 fw-bold text-dark">Trợ giúp</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none footer-link">Phương Thức Thanh Toán</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none footer-link">Chính Sách Đổi Trả</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none footer-link">Chính Sách Bảo Mật</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none footer-link">Câu Hỏi Thường Gặp</a></li>
            </ul>
          </div>

          {/* Cột 4 - Newsletter */}
          <div className="col-md-3">
            <h5 className="mb-3 fw-bold text-dark">Đăng ký nhận tin</h5>
            <p className="text-secondary small mb-3">Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
            <form className="newsletter-form">
              <div className="input-group mb-2">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Email của bạn"
                  style={{ borderRadius: '5px 0 0 5px' }}
                />
                <button 
                  className="btn text-white" 
                  type="submit"
                  style={{ backgroundColor: '#b88e2f', borderRadius: '0 5px 5px 0' }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr className="my-4" style={{ borderColor: '#ddd' }} />
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-secondary small mb-0">
              © 2025 MOVACLOTHES. All rights reserved | Designed with <i className="fas fa-heart text-danger"></i> by MovaTeam
            </p>
          </div>
        </div>
      </div>
      <div className="pb-3"></div>
    </footer>
  );
}

export default Footer;
