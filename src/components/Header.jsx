import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Khi load trang → kiểm tra user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Toggle menu user
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  // ✅ Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu-container")) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await axios.post(
          "http://localhost:8000/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Xóa dữ liệu đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);

    // Chuyển hướng
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <span>MOVACLOTHES</span>
        </Link>
         <img src="/Image/LogoHome.png" alt="MovaClothes Logo" />
      </div>

      {/* Menu */}
      <nav className="nav">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/shop">Cửa hàng</Link></li>
        <li><Link to="/blog">Giới thiệu</Link></li>
        <li><Link to="/contact">Liên hệ</Link></li>
      </nav>

      {/* Icons */}
      <div className="icons">
        {/* 👤 User menu */}
        <div className="user-menu-container">
          <i
            className="fas fa-user"
            onClick={toggleUserMenu}
            style={{ cursor: "pointer" }}
          ></i>

          {isMenuOpen && (
            <ul className="user-dropdown-menu">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              ) : (
                <>
                  <li className="dropdown-item" style={{ cursor: "default" }}>
                     Xin chào, <br /> <strong>{user.name}</strong>
                  </li>
                  <Link
                    to="/change-password"
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </ul>
          )}
        </div>

        <i className="fas fa-search"></i>
        <i className="fas fa-heart"></i>
        <i
          className="fas fa-shopping-cart"
          onClick={() => navigate("/cart")}
          style={{ cursor: "pointer" }}
        ></i>
      </div>
    </header>
  );
}

export default Header;