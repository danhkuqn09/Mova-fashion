import React, { useState } from "react";
import { loginUser } from "../api/auth";
import "../components/AuthForm.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await loginUser(formData);
      setMessage("Đăng nhập thành công!");
      localStorage.setItem("token", res.token);
      // Chuyển hướng
      window.location.href = "/";
    } catch (err) {
      setMessage(err.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        {message && <p className="msg">{message}</p>}

        <div className="social-login">
          <button className="google-btn">Đăng nhập bằng Google</button>
          <button className="facebook-btn">Đăng nhập bằng Facebook</button>
          <button className="apple-btn">Đăng nhập bằng Apple</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
