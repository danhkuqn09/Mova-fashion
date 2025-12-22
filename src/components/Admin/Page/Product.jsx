import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Product.css";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    });
    const formatVND = (value) =>
        Number(value || 0).toLocaleString("vi-VN") + "₫";

    const navigate = useNavigate();

    // Format giá tiền VND
    // const formatPrice = (value) => {
    //     if (!value) return "0";
    //     return Number(value).toLocaleString("vi-VN") + "₫";
    // };

    // Lấy danh sách sản phẩm
    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8000/api/products", {
                params: { page, per_page: pagination.per_page },
            });

            const data = res.data.data;
            const list = data.products || [];

            setProducts(list);

            setPagination({
                current_page: data.pagination.current_page,
                last_page: data.pagination.last_page,
                total: data.pagination.total,
                per_page: data.pagination.per_page,
            });

        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm?")) return;

        try {
            await axios.delete(
                `http://localhost:8000/api/admin/products/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error.response?.data);
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
                            <i className="fas fa-box text-primary me-2"></i>
                            Quản lý sản phẩm
                        </h1>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/admin/products/add")}
                        >
                            <i className="fas fa-plus me-2"></i>Thêm sản phẩm
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
                        <>
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '60px' }}>ID</th>
                                        <th style={{ width: '100px' }}>Hình ảnh</th>
                                        <th>Tên</th>
                                        <th style={{ width: '150px' }}>Giá</th>
                                        <th>Mô tả</th>
                                        <th style={{ width: '200px' }}>Hành động</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                                                Không có sản phẩm nào
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((prod) => (
                                            <tr key={prod.id}>
                                                <td className="fw-bold text-primary">#{prod.id}</td>
                                                <td>
                                                    <img
                                                        src={
                                                            prod.image
                                                                ? `http://localhost:8000${prod.image}`
                                                                : "/Image/no-image.png"
                                                        }
                                                        alt={prod.name}
                                                        className="rounded"
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                        onClick={() => window.open(`http://localhost:8000${prod.image}`, '_blank')}
                                                    />
                                                </td>

                                                <td className="fw-semibold">{prod.name}</td>
                                                <td>
                                                    {prod.sale_price ? (
                                                        <>
                                                            <del className="text-muted small d-block">{formatVND(prod.price)}</del>
                                                            <strong className="text-danger">{formatVND(prod.sale_price)}</strong>
                                                        </>
                                                    ) : (
                                                        <strong>{formatVND(prod.price)}</strong>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {prod.description ? (
                                                            prod.description.length > 50
                                                                ? prod.description.substring(0, 50) + '...'
                                                                : prod.description
                                                        ) : 'Không có mô tả'}
                                                    </small>
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-info me-1"
                                                        onClick={() => navigate(`/admin/products/view/${prod.id}`)}
                                                        title="Xem chi tiết"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-warning me-1"
                                                        onClick={() =>
                                                            navigate(`/admin/products/edit/${prod.id}`)
                                                        }
                                                        title="Chỉnh sửa"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(prod.id)}
                                                        title="Xóa"
                                                    >
                                                        <i className="fas fa-trash"></i>
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
                            {pagination.last_page > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <nav>
                                        <ul className="pagination">
                                            <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => fetchProducts(pagination.current_page - 1)}
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
                                                        onClick={() => fetchProducts(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => fetchProducts(pagination.current_page + 1)}
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

export default Products;
