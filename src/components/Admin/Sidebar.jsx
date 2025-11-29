import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBox, FiUsers, FiShoppingCart, FiList, FiMessageCircle, FiGift, FiBook, FiUser } from "react-icons/fi";
import "./admin.css";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { path: "/admin", label: "Dashboard", icon: <FiHome /> },
    { path: "/admin/categories", label: "Danh mục", icon: <FiList /> },
    { path: "/admin/products", label: "Sản phẩm", icon: <FiBox /> },
    { path: "/admin/users", label: "Người dùng", icon: <FiUsers /> },
    { path: "/admin/orders", label: "Đơn hàng", icon: <FiShoppingCart /> },
    { path: "/admin/comments", label: "Bình luận", icon: <FiMessageCircle /> },
    { path: "/admin/voucher", label: "Voucher", icon: <FiGift /> },
    { path: "/admin/news", label: "Tin tức", icon: <FiBook /> },
    { path: "/login", label: "Đăng Xuất", icon: <FiUser /> },
  ];

  return (
    <aside className="sidebar">
      <h2>MOVA Clothes</h2>
      <nav className="nav-menu"> 
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={pathname === link.path ? "active" : ""}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
