import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Dashboard.css"


const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [revenueDay, setRevenueDay] = useState([]);
  const [revenueMonth, setRevenueMonth] = useState([]);
  const [revenueYear, setRevenueYear] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadOverview = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOverview(res.data.data);
  };

  const loadRevenueByDay = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/revenue-by-day`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRevenueDay(res.data.data.revenues);
  };

  const loadRevenueByMonth = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/revenue-by-month`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRevenueMonth(res.data.data.revenues);
  };

  const loadRevenueByYear = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/revenue-by-year`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRevenueYear(res.data.data.revenues);
  };

  const loadPendingOrders = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/pending-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingOrders(res.data.data.data); // do paginate
  };

  const loadLowStockProducts = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/low-stock-products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLowStockProducts(res.data.data.products);
  };

  const loadRevenueComparison = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/revenue-comparison`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComparison(res.data.data);
  };

  const loadAll = async () => {
    try {
      await Promise.all([
        loadOverview(),
        loadRevenueByDay(),
        loadRevenueByMonth(),
        loadRevenueByYear(),
        loadPendingOrders(),
        loadLowStockProducts(),
        loadRevenueComparison(),
      ]);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) return <p>Đang tải Dashboard...</p>;

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-page">

          {/* ================== OVERVIEW ================== */}
          <h2 className="admin-section-title">Thống kê tổng quan</h2>
          <div className="dashboard-table">
            <table>
              <tbody>
                <tr><th>Tổng đơn hàng</th>
                <td>{overview.overview.total_orders}</td></tr>
                <tr><th>Người dùng</th>
                <td>{overview.overview.total_users}</td></tr>
                <tr><th>Sản phẩm</th>
                <td>{overview.overview.total_products}</td></tr>
                <tr><th>Tổng doanh thu</th>
                <td>{overview.overview.total_revenue.toLocaleString()} đ</td></tr>
                <tr><th>User mới 30 ngày</th>
                <td>{overview.overview.new_users_last_30_days}</td></tr>
              </tbody>
            </table>
          </div>

          {/* ================== DOANH THU NGÀY ================== */}
          <h2 className="admin-section-title">Doanh thu theo ngày</h2>
          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Doanh thu</th>
                  <th>Đơn hàng</th>
                </tr>
              </thead>
              <tbody>
                {revenueDay.map((item, i) => (
                  <tr key={i}>
                    <td>{item.date}</td>
                    <td>{item.revenue.toLocaleString()} đ</td>
                    <td>{item.order_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================== DOANH THU THÁNG ================== */}
          <h2 className="admin-section-title">Doanh thu theo tháng</h2>
          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Doanh thu</th>
                  <th>Đơn hàng</th>
                </tr>
              </thead>
              <tbody>
                {revenueMonth.map((item, i) => (
                  <tr key={i}>
                    <td>{item.month_name}</td>
                    <td>{item.revenue.toLocaleString()} đ</td>
                    <td>{item.order_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================== DOANH THU NĂM ================== */}
          <h2 className="admin-section-title">Doanh thu theo năm</h2>
          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>Năm</th>
                  <th>Doanh thu</th>
                  <th>Đơn hàng</th>
                </tr>
              </thead>
              <tbody>
                {revenueYear.map((item, i) => (
                  <tr key={i}>
                    <td>{item.year}</td>
                    <td>{item.revenue.toLocaleString()} đ</td>
                    <td>{item.order_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================== ĐƠN HÀNG CHỜ ================== */}
          <h2 className="admin-section-title">Đơn hàng chờ xác nhận</h2>
          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Người dùng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.order_code}</td>
                    <td>{order.user.name}</td>
                    <td>{order.final_total.toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================== SẢN PHẨM SẮP HẾT HÀNG ================== */}
          <h2 className="admin-section-title">Sản phẩm sắp hết hàng</h2>
          <div className="dashboard-table">
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng thấp nhất</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.lowest_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================== SO SÁNH DOANH THU ================== */}
          <h2 className="admin-section-title">So sánh doanh thu</h2>
          <div className="dashboard-table">
            <table>
              <tbody>
                <tr>
                  <th>Tháng này</th>
                  <td>{comparison.this_month.revenue.toLocaleString()} đ</td>
                </tr>
                <tr>
                  <th>Tháng trước</th>
                  <td>{comparison.last_month.revenue.toLocaleString()} đ</td>
                </tr>
                <tr>
                  <th>Tăng trưởng</th>
                  <td>{comparison.comparison.revenue_growth_percent}%</td>
                </tr>
                <tr>
                  <th>Xu hướng</th>
                  <td>{comparison.comparison.revenue_trend}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
