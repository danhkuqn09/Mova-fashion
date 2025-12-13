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

        // 🔹 Lấy URL redirect từ localStorage
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");

        // 🔹 Trigger event để Header cập nhật
        window.dispatchEvent(new Event("loginSuccess"));

        // 🔹 Redirect về trang trước đó hoặc trang chủ
        window.location.href = redirectTo;
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
