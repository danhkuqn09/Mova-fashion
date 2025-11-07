import React, { useState } from "react";
import axios from "axios";
import Footer from "../Footer";
import "./RegisterForm.css";

const RegisterForm = () => {
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
    <div className="register-page-layout">
      <div className="main-content-wrapper">
        <div className="registration-container">
          <div className="register-form-box">
            {step === 1 ? (
              <>
                <h2>Đăng Ký</h2>
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
                  <button type="submit" className="register-button">Đăng Ký</button>
                </form>
              </>
            ) : (
              <>
                <h2>Xác thực Email</h2>
                <p>Nhập mã OTP đã được gửi đến <b>{email}</b></p>
                <form onSubmit={handleVerifyOtp}>
                  <input
                    type="text"
                    value={otp}
                    placeholder="Nhập mã OTP gồm 6 số"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <button type="submit" className="register-button">Xác Nhận</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterForm;
