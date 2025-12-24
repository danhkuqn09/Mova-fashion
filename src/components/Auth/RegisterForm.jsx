import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    username: "",
    password: "",
    password_confirmation: "",
  });

  const [step, setStep] = useState(1); // 1: đăng ký, 2: nhập OTP
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResendOtp = async () => {
    setResending(true);
    setResendMessage("");
    
    try {
      const res = await axios.post("http://localhost:8000/api/resend-otp", {
        email,
      });
      setResendMessage(res.data.message || "Đã gửi lại mã OTP!");
    } catch (error) {
      setResendMessage(error.response?.data?.message || "Lỗi khi gửi lại OTP!");
    } finally {
      setResending(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/auth/google");
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Không thể kết nối Google. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đăng nhập với Google");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // === Bước 1: Đăng ký ===
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/register", formData);
      alert(res.data.message);
      setEmail(formData.email);
      setStep(2); // Chuyển sang bước nhập OTP
    } catch (error) {
      console.error(error);
      if (error.response?.data?.errors) {
        alert(JSON.stringify(error.response.data.errors));
      } else {
        alert("Đăng ký thất bại!");
      }
    }
  };

  // === Xác thực OTP ===
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/verify-otp", {
        email,
        otp,
      });
      alert(res.data.message);
      console.log("User info:", res.data.data);
      setStep(1); // Quay về đăng ký mới (hoặc chuyển trang login)
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Xác thực OTP thất bại!");
    }
  };

  return (
    <div className="auth-page-layout">
      <div className="auth-content-wrapper">
        <div className="auth-container">
          <div className="auth-form-box">
            {step === 1 ? (
              <>
                <h2>Đăng Ký</h2>
                <p className="auth-subtitle">Tạo tài khoản mới để bắt đầu mua sắm ngay hôm nay!</p>
                <form onSubmit={handleRegister}>
                  <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                  <input type="text" name="name" placeholder="Họ và Tên" onChange={handleChange} required />
                  <input type="tel" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
                  <input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} required />
                  <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
                  <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Nhập lại mật khẩu"
                    onChange={handleChange}
                    required
                  />
                  <button type="submit" className="auth-submit-btn">Đăng Ký</button>
                </form>
                
                <div className="auth-link-section">
                  Có tài khoản? <a href="/login">Đăng nhập ngay</a>
                </div>

                <div className="auth-divider">
                  <span className="auth-divider-line"></span>
                  <span className="auth-divider-text">hoặc</span>
                  <span className="auth-divider-line"></span>
                </div>

                <div className="social-buttons-grid">
                  <button
                    type="button"
                    className="google-signin-btn"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="google-text">Đăng ký với Google</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Xác thực Email</h2>
                <p className="auth-subtitle">
                  Nhập mã OTP đã được gửi đến <strong>{email}</strong>
                </p>
                
                {resendMessage && (
                  <div className={`auth-message ${resendMessage.includes("Lỗi") ? "error" : "success"}`}>
                    {resendMessage}
                  </div>
                )}
                
                <form onSubmit={handleVerifyOtp}>
                  <input
                    type="text"
                    value={otp}
                    placeholder="Nhập mã OTP gồm 6 số"
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                  />
                  
                  <div className="resend-otp-section">
                    <button 
                      type="button" 
                      onClick={handleResendOtp} 
                      disabled={resending}
                      className="resend-otp-btn"
                    >
                      {resending ? "Đang gửi..." : "Gửi lại mã OTP"}
                    </button>
                  </div>
                  
                  <button type="submit" className="auth-submit-btn">Xác Nhận</button>
                </form>
                <div className="auth-link-section">
                  <a href="/register" onClick={() => setStep(1)}>Quay lại đăng ký</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
