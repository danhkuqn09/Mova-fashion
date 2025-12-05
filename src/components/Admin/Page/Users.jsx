import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/User.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    // Filters
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    // User detail
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailUser, setDetailUser] = useState(null);

    // Change Role
    const [roleToChange, setRoleToChange] = useState("");
    const [showRoleModal, setShowRoleModal] = useState(false);
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
                    page
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
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

    // Show user detail
    const openUserDetail = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDetailUser(res.data.data);   // ⭐ dùng detailUser
            setShowDetailModal(true);
        } catch (err) {
            console.error("Lỗi khi lấy thông tin user", err);
            alert("Không thể lấy thông tin user. Vui lòng đăng nhập lại.");
        }
    };

    // Change role
    const openRoleModal = (user) => {
        setSelectedUser(user);
        setRoleToChange(user.role);
        setShowRoleModal(true);
    };

    const changeRole = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8000/api/admin/users/${selectedUser.id}/role`,
                { role: roleToChange },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Cập nhật role thành công!");
            setShowRoleModal(false);
            fetchUsers();
        } catch (err) {
            console.error("Lỗi khi đổi role", err);
            alert("Không thể đổi role! Bạn không có quyền hoặc token đã hết hạn.");

        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <h1>Quản lý người dùng</h1>

                    {/* Filters */}
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên / email / phone"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="">Tất cả</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>

                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="created_at">Ngày tạo</option>
                            <option value="name">Tên</option>
                            <option value="email">Email</option>
                        </select>

                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>
                    </div>

                    {/* Table */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Avatar</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Role</th>
                                <th>Tổng đơn</th>
                                <th>Chi tiêu</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9">Đang tải...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="9">Không có dữ liệu</td></tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>
                                            {u.avatar ? (
                                                <img src={u.avatar} className="user-avatar" />
                                            ) : "Không có"}
                                        </td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                        <td>{u.role}</td>
                                        <td>{u.total_orders}</td>
                                        <td>{u.total_spent.toLocaleString()}₫</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => openUserDetail(u.id)}>Xem</button>
                                            <button className="btn-delete" onClick={() => openRoleModal(u)}>Đổi role</button>
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
                                    onClick={() => fetchUsers(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Detail Modal */}
                    {showDetailModal && detailUser && (
                        <div className="modal-user">
                            <div className="modal-content">
                                <h2>Thông tin User</h2>
                                <p><b>Tên:</b> {detailUser.user.name}</p>
                                <p><b>Email:</b> {detailUser.user.email}</p>
                                <p><b>Đã xác thực:</b> {detailUser.user.email_verified_at || "Chưa"}</p>
                                <p><b>Tổng đơn:</b> {detailUser.statistics.total_orders}</p>
                                <p><b>Chi tiêu:</b> {detailUser.statistics.total_spent.toLocaleString()}₫</p>

                                <h3>5 đơn gần nhất</h3>
                                {detailUser.recent_orders.map(o => (
                                    <p key={o.id}>{o.order_code} - {o.final_total.toLocaleString()}₫</p>
                                ))}

                                <button onClick={() => setShowDetailModal(false)}>Đóng</button>
                            </div>
                        </div>
                    )}

                    {/* Role Modal */}
                    {showRoleModal && selectedUser && (
                        <div className="modal-user">
                            <div className="modal-content">
                                <h2>Đổi role cho {selectedUser.name}</h2>

                                <select value={roleToChange} onChange={(e) => setRoleToChange(e.target.value)}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <button onClick={changeRole}>Lưu</button>
                                <button onClick={() => setShowRoleModal(false)}>Hủy</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
