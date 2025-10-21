import React from 'react';
import { AiOutlineGoogle } from 'react-icons/ai'; 
import '../index.css';
// Import các hình ảnh nếu cần, hoặc dùng background CSS

const RegisterForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic xử lý đăng ký
    console.log("Đăng ký được nhấn!");
  };

  return (
    <div className="main-content-wrapper">
      <div className="registration-container">
        <div className="register-form-box">
          <h2>Đăng Ký</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Họ và Tên" required />
            <input type="tel" placeholder="Số điện thoại" />
            <input type="text" placeholder="Tên đăng nhập" required />
            <input type="password" placeholder="Mật khẩu" required />
            <input type="password" placeholder="Nhập lại mật khẩu" required />
            
            <button type="submit" className="register-button">Đăng Ký</button>
          </form>

          <div className="login-prompt">
            đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
          </div>

          <div className="social-login-separator">
            hoặc đăng nhập bằng
          </div>

          <div className="social-buttons-grid">
            <button className="social-login-button google">
              <AiOutlineGoogle size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterForm;