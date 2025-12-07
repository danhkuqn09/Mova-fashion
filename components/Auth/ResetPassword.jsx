import React, { useState } from "react";
import axios from "axios";
import Footer from "../Footer";
import "./resetpassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/reset-password", {
        email,
        otp,
        password,
        password_confirmation,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi đặt lại mật khẩu!");
    }
  };

  return (
    <>
    <div className="reset-password">
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleReset}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Mã OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Nhập lại mật khẩu" value={password_confirmation} onChange={(e) => setConfirm(e.target.value)} required />
        <button type="submit">Xác nhận</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </>
  );
  
};

export default ResetPassword;
