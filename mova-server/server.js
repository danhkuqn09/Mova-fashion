
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// API test
app.get("/", (req, res) => {
  res.send("✅ MovaClothes API is running!");
});

// Đăng ký
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;
  res.json({ message: `Đăng ký thành công cho ${email}` });
});

// Đăng nhập
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "test@gmail.com" && password === "123456") {
    res.json({ token: "fake-jwt-token", user: { email } });
  } else {
    res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
  }
});

app.listen(5000, () => console.log("🚀 Server chạy tại http://localhost:5000"));
    