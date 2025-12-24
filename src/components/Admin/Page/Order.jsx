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

  const paymentMethodTexts = {
    cod: "COD (Tiền mặt)",
    momo: "Momo",
  };

  const paymentStatusTexts = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    refunded: "Đã hoàn tiền",
  };

  const getPaymentStatusBadge = (status) => {
    const colors = {
      unpaid: "#ffc107",
      paid: "#28a745",
      refunded: "#6c757d",
    };
    return {
      backgroundColor: colors[status] || "#6c757d",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold",
    };
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">
              <i className="fas fa-shopping-cart text-primary me-2"></i>
              Quản lý đơn hàng
            </h1>
          </div>

          {/* Filters */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Tìm kiếm theo ID / tên / email / phone"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '60px' }}>ID</th>
                          <th>User</th>
                          <th style={{ width: '130px' }}>Tổng tiền</th>
                          <th style={{ width: '130px' }}>Giảm giá</th>
                          <th style={{ width: '140px' }}>Trạng thái</th>
                          <th style={{ width: '150px' }}>Phương thức TT</th>
                          <th style={{ width: '150px' }}>Trạng thái TT</th>
                          <th style={{ width: '100px' }}>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center text-muted py-4">
                              <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                              Không có đơn hàng nào
                            </td>
                          </tr>
                        ) : (
                          orders.map((o) => (
                            <tr key={o.id}>
                              <td className="fw-bold text-primary">#{o.id}</td>
                              <td>
                                <div className="fw-semibold">{o.user?.name || 'N/A'}</div>
                                <small className="text-muted">
                                  <i className="far fa-envelope me-1"></i>
                                  {o.user?.email || 'N/A'}
                                </small>
                              </td>
                              <td className="fw-bold text-success">{formatVND(o.final_total)}</td>
                              <td>{formatVND(30000)}</td>
                              <td className="text-danger">{formatVND(o.discount_amount) || formatVND(0)}</td>
                              <td>
                                <span className={`badge ${
                                  o.status === 'completed' ? 'bg-success' :
                                  o.status === 'shipping' ? 'bg-info' :
                                  o.status === 'processing' ? 'bg-primary' :
                                  o.status === 'cancelled' ? 'bg-danger' : 'bg-warning'
                                }`}>
                                  {statusTexts[o.status]}
                                </span>
                              </td>
                              <td>
                                <small>
                                  <i className="fas fa-credit-card me-1 text-muted"></i>
                                  {paymentMethodTexts[o.payment_method] || o.payment_method}
                                </small>
                              </td>
                              <td>
                                <span className={`badge ${
                                  o.payment_status === 'paid' ? 'bg-success' :
                                  o.payment_status === 'refunded' ? 'bg-secondary' : 'bg-warning'
                                }`}>
                                  {paymentStatusTexts[o.payment_status] || o.payment_status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                                  title="Xem chi tiết"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Phân trang */}
              {pagination.total > 0 && pagination.last_page > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => fetchOrders(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                      </li>
                      {[...Array(pagination.last_page)].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => fetchOrders(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => fetchOrders(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.last_page}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
