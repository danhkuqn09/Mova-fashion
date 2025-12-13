import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [revenueDay, setRevenueDay] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueMonth, setRevenueMonth] = useState([]);
  const [revenueYear, setRevenueYear] = useState([]);

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
    const res = await axios.get(
      "http://localhost:8000/api/admin/dashboard/revenue-by-month",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRevenueMonth(res.data.data.revenues);
  };

  const loadRevenueByYear = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/admin/dashboard/revenue-by-year",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRevenueYear(res.data.data.revenues);
  };

  const loadPendingOrders = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/pending-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingOrders(res.data.data.data);
  };

  const loadRevenueComparison = async () => {
    const res = await axios.get(`http://localhost:8000/api/admin/dashboard/revenue-comparison`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComparison(res.data.data);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn chuyển sang trạng thái "${newStatus}"?`)) {
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Cập nhật trạng thái thành công!");
        loadPendingOrders();
      } else {
        alert(res.data.message || "Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert("Lỗi validation:\n" + errorMessages);
      } else if (error.response?.data?.message) {
        alert("Lỗi: " + error.response.data.message);
      } else {
        alert("Lỗi: " + error.message);
      }
    }
  };

  const loadAll = async () => {
    try {
      await Promise.all([
        loadOverview(),
        loadRevenueByDay(),
        loadRevenueByMonth(),
        loadRevenueByYear(),
        loadPendingOrders(),
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

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <Topbar />
          <div className="dashboard-loading">
            <div className="loading-wrapper">
              <div className="spinner-container">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <h3 className="loading-text">Đang tải Dashboard...</h3>
              <p className="loading-subtext">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-page">
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #3498db' }}>
                <div className="card-body d-flex align-items-center">
                  <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-shopping-cart fa-2x text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">Tổng đơn hàng</h6>
                    <h3 className="mb-0 fw-bold">{overview.overview.total_orders.toLocaleString('vi-VN')}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #2ecc71' }}>
                <div className="card-body d-flex align-items-center">
                  <div className="flex-shrink-0 bg-success bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-box fa-2x text-success"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">Tổng sản phẩm</h6>
                    <h3 className="mb-0 fw-bold">{overview.overview.total_products.toLocaleString('vi-VN')}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #9b59b6' }}>
                <div className="card-body d-flex align-items-center">
                  <div className="flex-shrink-0 bg-secondary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-users fa-2x" style={{ color: '#9b59b6' }}></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">Người dùng</h6>
                    <h3 className="mb-0 fw-bold">{overview.overview.total_users.toLocaleString('vi-VN')}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #b88e2f' }}>
                <div className="card-body d-flex align-items-center">
                  <div className="flex-shrink-0 rounded-circle p-3 me-3" style={{ backgroundColor: 'rgba(184, 142, 47, 0.1)' }}>
                    <i className="fas fa-dollar-sign fa-2x" style={{ color: '#b88e2f' }}></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">Doanh thu</h6>
                    <h3 className="mb-0 fw-bold" style={{ fontSize: '1.4rem' }}>
                      {Number(overview.overview.total_revenue).toLocaleString('vi-VN')}₫
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-clock text-warning me-2"></i>Đơn hàng chờ xác nhận
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Người dùng</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                          Không có đơn hàng chờ xác nhận
                        </td>
                      </tr>
                    ) : (
                      pendingOrders.map(order => (
                        <tr key={order.id}>
                          <td><span className="badge bg-primary">#{order.order_code || `ID-${order.id}`}</span></td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td className="fw-semibold">
                            {order.final_total ? Number(order.final_total).toLocaleString('vi-VN') : '0'}₫
                          </td>
                          <td>
                            {(!order.status || order.status === 'pending') && <span className="badge bg-warning text-dark">Chờ xác nhận</span>}
                            {order.status === 'processing' && <span className="badge bg-info">Đang xử lý</span>}
                            {order.status === 'shipping' && <span className="badge bg-primary">Đang giao</span>}
                            {order.status === 'completed' && <span className="badge bg-success">Hoàn thành</span>}
                            {order.status === 'cancelled' && <span className="badge bg-danger">Đã hủy</span>}
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              style={{ minWidth: '150px' }}
                              value={order.status || 'pending'}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="processing">Đang xử lý</option>
                              <option value="shipping">Đang giao</option>
                              <option value="completed">Hoàn thành</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-calendar-day text-info me-2"></i>
                Doanh thu theo ngày
              </h5>
            </div>
            <div className="card-body">
              <Line
                data={{
                  labels: revenueDay.map((i) => i.date),
                  datasets: [
                    {
                      label: "Doanh thu (₫)",
                      data: revenueDay.map((i) => i.revenue),
                      borderWidth: 2,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (ctx) =>
                          Number(ctx.raw).toLocaleString("vi-VN") + "₫",
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (v) => Number(v).toLocaleString("vi-VN"),
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-calendar-alt text-primary me-2"></i>
                Doanh thu theo tháng
              </h5>
            </div>
            <div className="card-body">
              <Bar
                data={{
                  labels: revenueMonth.map((i) => i.month),
                  datasets: [
                    {
                      label: "Doanh thu (₫)",
                      data: revenueMonth.map((i) => i.revenue),
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) =>
                          Number(ctx.raw).toLocaleString("vi-VN") + "₫",
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (v) => Number(v).toLocaleString("vi-VN"),
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-calendar text-warning me-2"></i>
                Doanh thu theo năm
              </h5>
            </div>
            <div className="card-body">
              <Bar
                data={{
                  labels: revenueYear.map((i) => i.year),
                  datasets: [
                    {
                      label: "Doanh thu (₫)",
                      data: revenueYear.map((i) => i.revenue),
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) =>
                          Number(ctx.raw).toLocaleString("vi-VN") + "₫",
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (v) => Number(v).toLocaleString("vi-VN"),
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-chart-line" style={{ color: '#b88e2f' }}></i>
                <span className="ms-2">So sánh doanh thu</span>
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-calendar-check text-success me-2"></i>
                      <h6 className="mb-0 text-muted">Tháng này</h6>
                    </div>
                    <h4 className="mb-0 fw-bold text-success">{Number(comparison.this_month.revenue).toLocaleString('vi-VN')}₫</h4>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-calendar text-secondary me-2"></i>
                      <h6 className="mb-0 text-muted">Tháng trước</h6>
                    </div>
                    <h4 className="mb-0 fw-bold text-secondary">{Number(comparison.last_month.revenue).toLocaleString('vi-VN')}₫</h4>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-percentage text-primary me-2"></i>
                      <h6 className="mb-0 text-muted">Tăng trưởng</h6>
                    </div>
                    <h4 className="mb-0 fw-bold text-primary">{Number(comparison.comparison.revenue_growth_percent).toFixed(2)}%</h4>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-arrow-trend-up" style={{ color: '#b88e2f' }}></i>
                      <h6 className="mb-0 text-muted ms-2">Xu hướng</h6>
                    </div>
                    <h4 className="mb-0 fw-bold" style={{ color: '#b88e2f' }}>{comparison.comparison.revenue_trend}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
