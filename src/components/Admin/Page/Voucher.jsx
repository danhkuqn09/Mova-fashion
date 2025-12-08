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
                    <h1>Quản lý Voucher</h1>
                    <div className="voucher-header">
                        <div className="voucher-actions">
                            <input
                                type="text"
                                placeholder="Tìm theo mã voucher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button className="add-btn" onClick={() => navigate("/admin/voucher/add")}>
                            + Thêm voucher
                        </button>
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
                        <p>Đang tải...</p>
                    ) : (
                        <table className="voucher-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mã</th>
                                    <th>% Giảm</th>
                                    <th>Số lượng</th>
                                    <th>Đã dùng</th>
                                    <th>Còn lại</th>
                                    <th>Bắt đầu</th>
                                    <th>Kết thúc</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((v) => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>{v.code}</td>
                                        <td>{v.discount_percent}%</td>
                                        <td>{v.quantity}</td>
                                        <td>{v.used_count}</td>
                                        <td>{v.remaining_quantity}</td>
                                        <td>{formatDate(v.start_date)}</td>
                                        <td>{formatDate(v.end_date)}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${v.is_active ? "active" : "inactive"}`}
                                            >
                                                {v.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="toggle-btn" onClick={() => handleToggle(v.id)}>
                                                {v.is_active ? "Tắt" : "Bật"}
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDelete(v.id)}>
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Voucher;
