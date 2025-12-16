
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthPages.css";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const handleGoogleLogin = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/auth/google");
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url; // redirect trình duyệt
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        alert("Không thể kết nối Google. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đăng nhập với Google");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        username: email,
        password,
      });

      console.log("Kết quả từ Laravel:", res.data);

      // ✅ Kiểm tra đăng nhập thành công
      if (res.data.success) {
        // ✅ Lưu token và user vào localStorage
        localStorage.setItem("token", res.data.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        // ✅ Lấy URL redirect trước khi xóa
        const redirectTo = localStorage.getItem("redirectAfterLogin") || location.state?.from || "/";
        
        // ✅ Xóa redirectAfterLogin khỏi localStorage
        localStorage.removeItem("redirectAfterLogin");

        // ✅ Trigger event để Header cập nhật
        window.dispatchEvent(new Event("loginSuccess"));

        // ✅ Chuyển hướng ngay lập tức
        navigate(redirectTo, { replace: true });
      } else {
        setMessage(res.data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setMessage(JSON.stringify(error.response.data.errors));
      } else {
        setMessage("Đăng nhập thất bại! Kiểm tra lại thông tin hoặc server.");
      }
    }
  };

  return (
    <div className="auth-page-layout">
      <div className="auth-content-wrapper">
        <div className="auth-container">
          <div className="auth-form-box">
            <h2>Đăng Nhập</h2>
            <p className="auth-subtitle">Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.</p>
            
            {message && (
              <div className={`auth-message ${message.includes("thành công") ? "success" : "error"}`}>
                {message}
              </div>
            )}

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

              <button type="submit" className="auth-submit-btn">
                Đăng Nhập
              </button>
            </form>

            <div className="auth-link-section">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
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
                  <path fill="##EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="google-text">Đăng nhập với Google</span>
              </button>
            </div>
            
            <div className="auth-link-section mt-2">
              <a href="/forgot-password">Quên mật khẩu?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
