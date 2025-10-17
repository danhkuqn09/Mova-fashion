import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AuthForm.css";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không trùng khớp!");
      return;
    }
    alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");
  };

  // Xử lý đăng nhập mạng xã hội (mô phỏng)
  const handleSocialLogin = (provider) => {
    alert(`Đăng nhập bằng ${provider} thành công (demo).`);
  };

  const formVariants = {
    initial: { opacity: 0, x: isLogin ? 100 : -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? -100 : 100 },
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                onChange={handleChange}
                value={formData.password}
              />
              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              )}
              <button type="submit">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </button>
            </form>

            <p className="toggle-text">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <span className="toggle-link" onClick={toggleForm}>
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </span>
            </p>

            {/* Mạng xã hội */}
            <div className="social-login">
              <p>Hoặc đăng nhập bằng</p>
              <div className="social-buttons">
                <button
                  className="social-btn google"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <FaGoogle /> Google
                </button>
                <button
                  className="social-btn facebook"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <FaFacebookF /> Facebook
                </button>
                <button
                  className="social-btn apple"
                  onClick={() => handleSocialLogin("Apple")}
                >
                  <FaApple /> Apple
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AuthForm;
