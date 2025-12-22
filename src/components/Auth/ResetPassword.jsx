
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthPages.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";
  const email = queryParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Không cần resend OTP nữa

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!token || !email) {
      setMessage("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      setIsSuccess(false);
      return;
    }
    try {
      const res = await axios.post("http://localhost:8000/api/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });
      setMessage(res.data.message || "Đặt lại mật khẩu thành công!");
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi đặt lại mật khẩu!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-page-layout">
      <div className="auth-content-wrapper">
        <div className="auth-container">
          <div className="auth-form-box">
            <h2>Đặt lại mật khẩu</h2>
            <p className="auth-subtitle">
              Vui lòng nhập mật khẩu mới của bạn.
            </p>
            {message && (
              <div className={`auth-message ${isSuccess ? "success" : "error"}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleReset}>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={password_confirmation}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button type="submit" className="auth-submit-btn">Xác nhận</button>
            </form>
            <div className="auth-link-section">
              <a href="/login">← Quay lại đăng nhập</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ResetPassword;
