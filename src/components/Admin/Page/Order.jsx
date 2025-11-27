import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "../admin.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusToChange, setStatusToChange] = useState("");

  const token = localStorage.getItem("token");

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

  const openDetailModal = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(res.data.data);
      setStatusToChange(res.data.data.status);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng", err);
    }
  };

  const changeStatus = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/orders/${selectedOrder.id}/status`,
        { status: statusToChange },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cập nhật trạng thái thành công!");
      setShowDetailModal(false);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi đổi trạng thái", err);
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const deleteOrder = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/orders/${selectedOrder.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Xóa đơn hàng thành công!");
      setShowDetailModal(false);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi xóa đơn hàng", err);
      alert(err.response?.data?.message || "Lỗi khi xóa đơn hàng");
    }
  };

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
                <th>Discount</th>
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
                    <td>{o.final_total.toLocaleString()}₫</td>
                    <td>{o.discount_amount?.toLocaleString() || 0}₫</td>
                    <td>{o.status}</td>
                    <td>{o.payment_method}</td>
                    <td>
                      <button onClick={() => openDetailModal(o.id)}>Xem</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
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

          {/* Detail Modal */}
          {showDetailModal && selectedOrder && (
            <div className="modal">
              <div className="modal-content">
                <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
                <p><b>User:</b> {selectedOrder.user?.name || selectedOrder.user?.email}</p>
                <p><b>Trạng thái:</b> {selectedOrder.status}</p>
                <p><b>Thanh toán:</b> {selectedOrder.payment_method}</p>
                <p><b>Tổng tiền:</b> {selectedOrder.final_total.toLocaleString()}₫</p>
                <p><b>Discount:</b> {selectedOrder.discount_amount?.toLocaleString() || 0}₫</p>

                <h3>Items</h3>
                {selectedOrder.items.map((item) => (
                  <p key={item.id}>
                    {item.productVariant?.product?.name || "Sản phẩm"} x {item.quantity} = {item.price.toLocaleString()}₫
                  </p>
                ))}

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <select value={statusToChange} onChange={(e) => setStatusToChange(e.target.value)}>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <button onClick={changeStatus}>Cập nhật trạng thái</button>
                  {selectedOrder.status === "cancelled" && <button onClick={deleteOrder}>Xóa đơn</button>}
                  <button onClick={() => setShowDetailModal(false)}>Đóng</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
