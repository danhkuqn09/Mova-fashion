
import React, { useState } from "react";
import axios from "axios";
import { AiOutlineGoogle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
// import Header from "./Header";
import Footer from "../Footer";
import { FaFacebookF, FaApple } from "react-icons/fa";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
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
        setMessage(res.data.message || "Đăng nhập thành công! Đang chuyển hướng...");

        // ✅ Lưu token và user vào localStorage
        localStorage.setItem("token", res.data.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        // ✅ Trigger event để Header cập nhật
        window.dispatchEvent(new Event("loginSuccess"));

        // ✅ Chuyển hướng về trang chủ
        setTimeout(() => {
          navigate("/");
        }, 1000);
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
    <div className="login-page-layout">
      <div className="main-content-wrapper">
        <div className="registration-container">
          <div className="register-form-box">
            <h2>Đăng Nhập</h2>
            {message && (
              <p
                style={{
                  color: message.includes("thành công") ? "green" : "red",
                  marginBottom: "15px",
                  fontWeight: "bold",
                }}
              >
                {message}
              </p>
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

              <button type="submit" className="register-button">
                Đăng Nhập

              </button>

            </form>

            <div className="login-prompt">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </div>

            <div className="social-login-separator">hoặc đăng nhập bằng</div>

            <div className="social-buttons-grid">
              <button
                className="social-login-button google"
                onClick={handleGoogleLogin}
              >
                <AiOutlineGoogle size={20} /> Đăng nhập với Google
              </button>


            </div>
            <div className="forget-password">
              <a href="/forgot-password">Quên mật khẩu?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
