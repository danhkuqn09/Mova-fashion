import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(user));

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decodedUser));

        console.log("✅ Đăng nhập Google thành công:", decodedUser);

        // 🔹 Reload lại toàn trang để Header đọc được localStorage
        window.location.href = "/";
      } catch (error) {
        console.error("❌ Lỗi khi giải mã user:", error);
        window.location.href = "/login";
      }
    } else {
      console.error("❌ Đăng nhập thất bại: Thiếu token hoặc user");
      window.location.href = "/login";
    }
  }, [navigate]);

  return <div>Đang xử lý đăng nhập Google...</div>;
}

export default LoginSuccess;
