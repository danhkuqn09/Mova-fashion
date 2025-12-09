import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Parse user error:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu-container")) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.post(
          "http://localhost:8000/api/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  // 🔍 Hàm xử lý khi bấm Enter hoặc click nút tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/shop?keyword=${encodeURIComponent(searchTerm)}`);
    setShowSearch(false);
  };

  return (
    <header className="header shadow-sm">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-3">
            <div className="logo">
              <Link to="/" className="d-flex align-items-center text-decoration-none">
                <img src="/Image/LogoHome.png" alt="MovaClothes Logo" className="me-2" />
                <span className="fw-bold">MOVACLOTHES</span>
              </Link>
            </div>
          </div>

          <nav className="col-md-6">
            <ul className="nav justify-content-center">
              <li className="nav-item"><Link to="/" className="nav-link">Trang chủ</Link></li>
              <li className="nav-item"><Link to="/shop" className="nav-link">Cửa hàng</Link></li>
              <li className="nav-item"><Link to="/news" className="nav-link">Giới thiệu</Link></li>
              <li className="nav-item"><Link to="/contact" className="nav-link">Liên hệ</Link></li>
            </ul>
          </nav>

          <div className="col-md-3">
            <div className="icons d-flex justify-content-end align-items-center gap-3">
        {/* 👤 User */}
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
                  <Link to="/login" className="dropdown-item">Đăng nhập</Link>
                  <Link to="/register" className="dropdown-item">Đăng ký</Link>
                </>
              ) : (
                <>
                  <li className="dropdown-item" style={{ cursor: "default" }}>
                    Xin chào, <br /> <strong>{user.name}</strong>
                  </li>
                  <Link to="/user" className="dropdown-item">Thông tin cá nhân</Link>
                  <Link to="/change-password" className="dropdown-item">Đổi mật khẩu</Link>
                  <Link to="/order" className="dropdown-item">Đơn Hàng</Link>
                  <Link to="/my-news" className="dropdown-item">Bài viết của tôi</Link>

                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Đăng xuất
                  </button>
                </>
              )}
            </ul>
          )}

        </div>

        {/* 🔍 Icon search */}
        <div className="search-container">
          <i
            className="fas fa-search"
            onClick={() => setShowSearch((prev) => !prev)}
            style={{ cursor: "pointer" }}
          ></i>

          {showSearch && (
            <form onSubmit={handleSearch} className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button type="submit">
                <i className="fas fa-search"></i>
              </button>
            </form>
          )}
        </div>
        <i
          className="fas fa-shopping-cart"
          onClick={() => navigate("/cart")}
          style={{ cursor: "pointer" }}
        ></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
