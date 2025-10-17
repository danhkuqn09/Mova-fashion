import axios from "axios";

// Cấu hình API baseURL (sửa lại theo backend của bạn)
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Gọi API đăng ký
export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);
    return res.data;
  } catch (err) {
    console.error("Register error:", err);
    throw err.response?.data || err;
  }
};

// Gọi API đăng nhập
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    return res.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err.response?.data || err;
  }
};
