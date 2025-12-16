import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // 🔹 lấy token đăng nhập
      const res = await axios.post(
        "http://localhost:8000/api/change-password",
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword, 
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem(token)}` },
        }
      );

      setMessage(res.data.message);

      // Đăng nhập thành công thì chuyển về trang đăng nhập
      if (res.data.message.includes("thành công")) {
        setTimeout(() => {
          localStorage.removeItem("token"); // xóa token cũ 
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      if (error.response?.status === 401) {
    localStorage.removeItem("token");
    navigate("/login"); // tự động chuyển về trang đăng nhập
  }
    }
  };

  return (
    <div className="auth-page-layout">
      <div className="auth-content-wrapper">
        <div className="auth-container">
          <div className="auth-form-box">
            <h2>Đổi mật khẩu</h2>
            <p className="auth-subtitle">
              Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.
            </p>
            
            {message && (
              <div className={`auth-message ${message.includes("thành công") ? "success" : "error"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Mật khẩu hiện tại"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit" className="auth-submit-btn">
                Xác nhận đổi mật khẩu
              </button>
            </form>
            
            <div className="auth-link-section">
              <a href="/user">← Quay lại trang cá nhân</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
