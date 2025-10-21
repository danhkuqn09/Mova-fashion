import React from 'react';
import { AiOutlineGoogle } from 'react-icons/ai'; 
import './RegisterForm.css'; // File CSS ở bước 2
import Header from "./Header"; // Component Header của bạn
import Footer from "./Footer"; // Component Footer của bạn

const RegisterForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic xử lý đăng ký
    console.log("Đăng ký được nhấn!");
  };

  return (
    // 1. Bọc TẤT CẢ trong một thẻ div chung
    
    <div className="register-page-layout"> 
     <Header />
     
      {/* 3. 'main-content-wrapper' (có ảnh nền) BÂY GIỜ CHỈ BỌC FORM */}
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
      
      {/* 4. Footer nằm ở ngoài */}
      <Footer />
    </div>
  );
};

export default RegisterForm;