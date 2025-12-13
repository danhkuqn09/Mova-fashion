import "./Header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (!token) {
        // Không có token, xóa user info
        localStorage.removeItem("user");
        setUser(null);
        return;
      }
      
      // Nếu có storedUser, hiển thị ngay để UX tốt hơn
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Parse user error:", e);
        }
      }
      
      try {
        // Verify token với backend
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Token hợp lệ, cập nhật user info
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        // Token không hợp lệ hoặc hết hạn
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };
    
    verifyToken();
    
    // Lắng nghe sự kiện login từ các component khác
    const handleLoginSuccess = () => {
      verifyToken();
    };
    
    window.addEventListener("loginSuccess", handleLoginSuccess);
    
    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
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
              <li className="nav-item"><Link to="/about" className="nav-link">Chúng Tôi</Link></li>
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
                  <Link 
                    to="/login" 
                    state={{ from: location.pathname }}
                    className="dropdown-item"
                  >
                    Đăng nhập
                  </Link>
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
