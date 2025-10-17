import React from "react";

const Navbar = () => {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <div className="logo">MovaClothes</div>
          <div className="mini-logo"> <span className="circle-logo">M</span> </div>
        </div>

        <nav className="nav-center">
          <a href="/">Trang Chủ</a>
          <a href="/">Cửa Hàng</a>
          <a href="/">Giới Thiệu</a>
          <a href="/">Liên Hệ</a>
        </nav>

        <div className="nav-right">
          <span className="icon">👤</span>
          <span className="icon">🔍</span>
          <span className="icon">♡</span>
          <span className="icon">🛒</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
