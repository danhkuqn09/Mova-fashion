import React from "react";

const Topbar = () => {
  return (
    <header className="topbar">
      <h2>Trang Quản Trị</h2>
      <div className="admin-profile">
        <img src="https://i.pravatar.cc/40" alt="admin" />
        <span>Admin</span>
      </div>
    </header>
  );
};

export default Topbar;
