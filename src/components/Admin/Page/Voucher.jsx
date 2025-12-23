import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/Voucher.css";
import { useNavigate } from "react-router-dom";


const Voucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [newVoucher, setNewVoucher] = useState({
        code: "",
        discount_percent: "",
        quantity: "",
        min_total: "",
        start_date: "",
        end_date: "",
        max_discount_amount: "",
    });
    // ngày giờ
    const formatDate = (isoDate) => {
        if (!isoDate) return "-";
        const date = new Date(isoDate);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const token = localStorage.getItem("token");

    // Lấy danh sách voucher
    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8000/api/admin/vouchers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("RAW API DATA:", res.data);        // 👈 LOG TOÀN BỘ API
            console.log("VOUCHER LIST:", res.data.data);   // 👈 LOG MẢNG VOUCHER
            setVouchers(res.data.data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách Voucher", err);
            alert("Không thể lấy danh sách Voucher");
        } finally {
            setLoading(false);
        }
    };

    // Tạo voucher mới
    const handleCreate = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/admin/vouchers",
                newVoucher,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Thêm voucher thành công!");
            setShowAddForm(false);
            setNewVoucher({
                code: "",
                discount_percent: "",
                quantity: "",
                min_total: "",
                start_date: "",
                end_date: "",
                max_discount_amount: "",
            });
            fetchVouchers();
        } catch (err) {
            console.error("Create voucher error:", err);
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                alert(firstError);
            } else {
                alert("Không thể tạo voucher");
            }
        }
    };

    // Bật/Tắt voucher
    const handleToggle = async (id) => {
        try {
            await axios.post(
                `http://localhost:8000/api/admin/vouchers/${id}/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchVouchers();
        } catch (err) {
            alert("Không thể thay đổi trạng thái voucher");
            console.error(err)
        }
    };

    // Xóa voucher
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) return;
        try {
            await axios.delete(
                `http://localhost:8000/api/admin/vouchers/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchVouchers();
        } catch (err) {
            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Không thể xóa voucher");
            }
        }
    };

    const filteredData = vouchers.filter(v =>
        v.code.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        fetchVouchers();
    }, []);

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">
                            <i className="fas fa-ticket-alt text-primary me-2"></i>
                            Quản lý voucher
                        </h1>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/admin/voucher/add")}
                        >
                            <i className="fas fa-plus me-2"></i>Thêm voucher
                        </button>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="fas fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Tìm theo mã voucher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Popup Form */}
                    {showAddForm && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Thêm Voucher</h2>

                                <input
                                    type="text"
                                    placeholder="Mã voucher"
                                    value={newVoucher.code}
                                    onChange={(e) =>
                                        setNewVoucher({ ...newVoucher, code: e.target.value })
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="% giảm"
                                    value={newVoucher.discount_percent}
                                    onChange={(e) =>
                                        setNewVoucher({ ...newVoucher, discount_percent: e.target.value })
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Số lượng"
                                    value={newVoucher.quantity}
                                    onChange={(e) =>
                                        setNewVoucher({ ...newVoucher, quantity: e.target.value })
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Đơn tối thiểu"
                                    value={newVoucher.min_total}
                                    onChange={(e) =>
                                        setNewVoucher({ ...newVoucher, min_total: e.target.value })
                                    }
                                />
                                <input
                                    type="date"
                                    value={newVoucher.start_date}
                                    onChange={(e) =>
                                        setNewVoucher({ ...newVoucher, start_date: e.target.value })
                                    }
                                />
                                <input
                                    type="date"
                                    value={newVoucher.end_date}
                                    onChange={(e) =>
                                        setNewVoucher({ ...newVoucher, end_date: e.target.value })
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Giảm tối đa"
                                    value={newVoucher.max_discount_amount}
                                    onChange={(e) =>
                                        setNewVoucher({
                                            ...newVoucher,
                                            max_discount_amount: e.target.value,
                                        })
                                    }
                                />

                                <div className="form-buttons">
                                    <button onClick={handleCreate}>Tạo voucher</button>
                                    <button onClick={() => setShowAddForm(false)}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: '60px' }}>ID</th>
                                                <th>Mã</th>
                                                <th style={{ width: '100px' }}>% Giảm</th>
                                                <th style={{ width: '100px' }}>Số lượng</th>
                                                <th style={{ width: '100px' }}>Đã dùng</th>
                                                <th style={{ width: '100px' }}>Còn lại</th>
                                                <th style={{ width: '150px' }}>Bắt đầu</th>
                                                <th style={{ width: '150px' }}>Kết thúc</th>
                                                <th style={{ width: '150px' }}>Trạng thái</th>
                                                <th style={{ width: '150px' }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.length > 0 ? (
                                                filteredData.map((v) => (
                                                    <tr key={v.id}>
                                                        <td className="fw-bold text-primary">#{v.id}</td>
                                                        <td>
                                                            <span className="badge bg-secondary" style={{ fontSize: '14px' }}>
                                                                {v.code}
                                                            </span>
                                                        </td>
                                                        <td className="fw-semibold text-success">{v.discount_percent}%</td>
                                                        <td className="text-center">{v.quantity}</td>
                                                        <td className="text-center text-danger fw-semibold">{v.used_count}</td>
                                                        <td className="text-center text-success fw-semibold">{v.remaining_quantity}</td>
                                                        <td>
                                                            <small className="text-muted">
                                                                <i className="far fa-calendar-alt me-1"></i>
                                                                {formatDate(v.start_date)}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                <i className="far fa-calendar-alt me-1"></i>
                                                                {formatDate(v.end_date)}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${v.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                {v.is_active ? (
                                                                    <><i className="fas fa-check-circle me-1"></i>Đang hoạt động</>
                                                                ) : (
                                                                    <><i className="fas fa-times-circle me-1"></i>Ngừng hoạt động</>
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                {/* Nút chỉnh sửa */}
                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    title="Chỉnh sửa"
                                                                    onClick={() => navigate(`/admin/voucher/edit/${v.id}`)}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>

                                                                {/* Bật / Tắt */}
                                                                <button
                                                                    className={`btn btn-sm ${v.is_active ? 'btn-secondary' : 'btn-success'}`}
                                                                    onClick={() => handleToggle(v.id)}
                                                                    title={v.is_active ? 'Tắt voucher' : 'Bật voucher'}
                                                                >
                                                                    <i className={`fas ${v.is_active ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i>
                                                                </button>

                                                                {/* Xóa */}
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDelete(v.id)}
                                                                    title="Xóa"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center text-muted py-4">
                                                        <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                                                        Không tìm thấy voucher nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Voucher;
