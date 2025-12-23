import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/User.css";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Filters
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const formatVND = (value) =>
        Number(value || 0).toLocaleString("vi-VN") + "₫";
    const updateRole = async (userId, newRole) => {
        if (!window.confirm(`Bạn có chắc muốn đổi role thành "${newRole}"?`)) return;

        try {
            const res = await axios.put(
                `http://localhost:8000/api/admin/users/${userId}/role`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                alert("Đổi role thành công!");
                fetchUsers(pagination.current_page);
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Lỗi khi đổi role");
        }
    };
    // Fetch list
    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8000/api/admin/users", {
                params: {
                    per_page: 10,
                    search,
                    role: roleFilter,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                    page,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(res.data.data.data);
            setPagination(res.data.data);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi load danh sách user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter, sortBy, sortOrder]);

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">
                            <i className="fas fa-users text-primary me-2"></i>
                            Quản lý người dùng
                        </h1>
                    </div>

                    {/* Filters */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="fas fa-search text-muted"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-0"
                                            placeholder="Tìm kiếm theo tên / email / phone"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="created_at">Ngày tạo</option>
                                        <option value="name">Tên</option>
                                        <option value="email">Email</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                    >
                                        <option value="asc">Tăng dần</option>
                                        <option value="desc">Giảm dần</option>
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
                                                    <th style={{ width: '80px' }}>Avatar</th>
                                                    <th>Tên</th>
                                                    <th>Email</th>
                                                    <th style={{ width: '120px' }}>SĐT</th>
                                                    <th style={{ width: '150px' }}>Role</th>
                                                    <th style={{ width: '100px' }}>Tổng đơn</th>
                                                    <th style={{ width: '150px' }}>Chi tiêu</th>
                                                    <th style={{ width: '100px' }}>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" className="text-center text-muted py-4">
                                                            <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                                                            Không có dữ liệu
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    users.map((u) => (
                                                        <tr key={u.id}>
                                                            <td className="fw-bold text-primary">#{u.id}</td>
                                                            <td>
                                                                {u.avatars ? (
                                                                    <img
                                                                        src={`http://localhost:8000${u.avatars}`}
                                                                        alt={u.name}
                                                                        className="rounded-circle"
                                                                        style={{
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            objectFit: 'cover',
                                                                            cursor: 'pointer',
                                                                            transition: 'transform 0.3s ease'
                                                                        }}
                                                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                                        onClick={() => window.open(`http://localhost:8000${u.avatars}`, '_blank')}
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                                                                        style={{ width: '50px', height: '50px' }}
                                                                    >
                                                                        <i className="fas fa-user"></i>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="fw-semibold">{u.name}</td>
                                                            <td>
                                                                <small className="text-muted">
                                                                    <i className="far fa-envelope me-1"></i>
                                                                    {u.email}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <small>
                                                                    <i className="fas fa-phone me-1 text-muted"></i>
                                                                    {u.phone || 'N/A'}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={u.role}
                                                                    onChange={(e) => updateRole(u.id, e.target.value)}
                                                                >
                                                                    <option value="user">User</option>
                                                                    <option value="admin">Admin</option>
                                                                </select>
                                                            </td>
                                                            <td className="text-center">
                                                                <span className="badge bg-info" style={{ fontSize: '14px' }}>
                                                                    {u.total_orders}
                                                                </span>
                                                            </td>
                                                            <td className="fw-bold text-success">{formatVND(u.total_spent)}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-info"
                                                                    onClick={() => navigate(`/admin/users/${u.id}`)}
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

                            {/* Pagination */}
                            {pagination.total > 0 && pagination.last_page > 1 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => fetchUsers(pagination.current_page - 1)}
                                                disabled={pagination.current_page === 1}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                        </li>
                                        {[...Array(pagination.last_page)].map((_, i) => (
                                            <li key={i} className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => fetchUsers(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => fetchUsers(pagination.current_page + 1)}
                                                disabled={pagination.current_page === pagination.last_page}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
