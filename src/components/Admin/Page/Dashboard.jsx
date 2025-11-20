// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import DashboardCard from "../DashboardCard";
import "../admin.css";

// Dữ liệu mẫu (nếu chưa có backend)
const getDashboardData = async () => ({
  totalUsers: 150,
  totalOrders: 82,
  totalRevenue: 12500000,
  totalProducts: 46,
});

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  if (!data) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="dashboard-content">
          <h2>Dashboard</h2>
          <div className="dashboard-cards">
            <DashboardCard title="Người dùng" value={data.totalUsers} />
            <DashboardCard title="Đơn hàng" value={data.totalOrders} />
            <DashboardCard title="Doanh thu" value={data.totalRevenue.toLocaleString("vi-VN")} />
            <DashboardCard title="Sản phẩm" value={data.totalProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
