// src/components/LoginForm.jsx

import React, { useState } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Header from "./Header"; // Component Header của bạn
import Footer from "./Footer"; // Component Footer của bạn
// Nếu muốn dùng icon khác, bạn cần import thêm
import { FaFacebookF, FaApple } from 'react-icons/fa'; // Cần cài thêm nếu chưa có: npm install react-icons

import '../index.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // ⚠️ KHỞI TẠO HOOK
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    // --- LOGIC ĐĂNG NHẬP GIẢ LẬP ---
    if (email === '123@gmail.com' && password === '123') {
      setMessage("Đăng nhập thành công! Đang chuyển hướng...");

      // ⚠️ THỰC HIỆN CHUYỂN HƯỚNG
      // Chuyển hướng về trang chủ sau 1 giây
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } else {
      setMessage('Email hoặc Mật khẩu không đúng. Vui lòng thử lại.');
    }
  };
  return (
    <div className="login-page-layout">
      <Header />
      <div className="main-content-wrapper">
        <div className="registration-container">
          <div className="register-form-box">
            <h2>Đăng Nhập</h2>

            {message &&
              <p style={{
                color: message.includes('thành công') ? 'green' : 'red',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>{message}</p>
            }

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Mật Khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="register-button">Đăng Nhập</button>
            </form>

            <div className="login-prompt">
              chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
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
      <Footer />
    </div>
  );
};

export default LoginForm;