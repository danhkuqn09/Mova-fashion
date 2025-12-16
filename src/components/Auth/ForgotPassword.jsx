import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // khởi tạo hook điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/forgot-password", {
        email,
      });

      setMessage(res.data.message);

      // 🔹 Nếu gửi mail thành công, chờ 1 giây rồi chuyển sang trang ResetPassword
      
        setTimeout(() => {
          navigate("/reset-password", { state: { email } }); 
          // Truyền email sang trang đặt lại mật khẩu
        }, 1000);
      
    } catch (error) {
      if (error.response?.data?.errors) {
        setMessage(Object.values(error.response.data.errors).join(", "));
      } else {
        setMessage("Không thể gửi email. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-layout">
      <div className="auth-content-wrapper">
        <div className="auth-container">
          <div className="auth-form-box">
            <h2>Quên mật khẩu</h2>
            <p className="auth-subtitle">
              Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
            </p>
            
            {message && (
              <div className="auth-message success">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    Đang gửi...
                    <span className="auth-loading"></span>
                  </>
                ) : (
                  "Gửi liên kết về Email"
                )}
              </button>
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

export default ForgotPassword;
