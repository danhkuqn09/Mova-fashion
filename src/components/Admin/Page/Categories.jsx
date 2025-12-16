import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Categories.css";
import { useNavigate } from "react-router-dom";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "http://localhost:8000/api/categories",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            let data = res.data.data;
            const list = Array.isArray(data) ? data : data.categories;

            list.sort((a, b) => a.id - b.id);
            setCategories(list);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/admin/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
            alert(error.response?.data?.message || "Đã xảy ra lỗi");
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">
                            <i className="fas fa-th-large text-primary me-2"></i>
                            Quản lý danh mục
                        </h1>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/admin/categories/add")}
                        >
                            <i className="fas fa-plus me-2"></i>Thêm danh mục
                        </button>
                    </div>

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
                                                <th style={{ width: '100px' }}>Ảnh</th>
                                                <th>Tên danh mục</th>
                                                <th>Mô tả</th>
                                                <th style={{ width: '180px' }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <tr key={cat.id}>
                                                        <td className="fw-bold text-primary">#{cat.id}</td>
                                                        <td>
                                                            {cat.image ? (
                                                                <img
                                                                    src={`http://localhost:8000${cat.image}`}
                                                                    alt={cat.name}
                                                                    className="rounded"
                                                                    style={{
                                                                        width: '70px',
                                                                        height: '70px',
                                                                        objectFit: 'cover',
                                                                        cursor: 'pointer',
                                                                        transition: 'transform 0.3s ease'
                                                                    }}
                                                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                                    onClick={() => window.open(`http://localhost:8000${cat.image}`, '_blank')}
                                                                />
                                                            ) : (
                                                                <span className="text-muted small">Không có ảnh</span>
                                                            )}
                                                        </td>
                                                        <td className="fw-semibold">{cat.name}</td>
                                                        <td>
                                                            <small className="text-muted">
                                                                {cat.description ? (
                                                                    cat.description.length > 80 
                                                                        ? cat.description.substring(0, 80) + '...' 
                                                                        : cat.description
                                                                ) : 'Không có mô tả'}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    onClick={() => navigate(`/admin/categories/edit/${cat.id}`)}
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDelete(cat.id)}
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
                                                    <td colSpan="5" className="text-center text-muted py-4">
                                                        Không có danh mục nào
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

export default Categories;
