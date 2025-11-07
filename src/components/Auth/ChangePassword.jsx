import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import Footer from "../Footer";
import "./changepassword.css";

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
    <div className="login-page-layout">
      <div className="main-content-wrapper">
        <div className="registration-container">
          <div className="register-form-box">
            <h2>Đổi mật khẩu</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}

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

              <button type="submit" className="register-button">
                Xác nhận đổi mật khẩu
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePassword;
