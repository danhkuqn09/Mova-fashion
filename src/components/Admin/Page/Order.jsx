import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/Order.css";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter,] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const formatVND = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + "₫";

  const statusTexts = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    shipping: "Đang giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/admin/orders", {
        params: {
          per_page: 10,
          status: statusFilter,
          search,
          page,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data.data.data);
      setPagination(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi load danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-page">
          <h1>Quản lý đơn hàng</h1>

          {/* Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="Tìm kiếm theo ID / tên / email / phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Table */}
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Tổng tiền</th>
                <th>Giảm giá</th>
                <th>Trạng thái</th>
                <th>Phương thức thanh toán</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Đang tải...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="7">Không có dữ liệu</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user?.name || o.user?.email}</td>
                    <td>{formatVND(o.final_total)}</td>
                    <td>{formatVND(o.discount_amount) || formatVND(0)}</td>
                    <td>{statusTexts[o.status]}</td>
                    <td>{o.payment_method}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          {pagination.total > 0 && (
            <div className="pagination">
              {[...Array(pagination.last_page)].map((_, i) => (
                <button
                  key={i}
                  className={pagination.current_page === i + 1 ? "active" : ""}
                  onClick={() => fetchOrders(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
