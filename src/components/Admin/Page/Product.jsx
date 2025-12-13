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
                    <div className="admin-header">
                        <h1>Quản lý sản phẩm</h1>

                        <button
                            className="add-btn"
                            onClick={() => navigate("/admin/products/add")}
                        >
                            ➕ Thêm sản phẩm
                        </button>
                    </div>

                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Hình ảnh</th>
                                        <th>Tên</th>
                                        <th>Giá</th>
                                        <th>Mô tả</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((prod) => (
                                        <tr key={prod.id}>
                                            <td>{prod.id}</td>
                                            <td>
                                                <img
                                                    src={
                                                        prod.image
                                                            ? `http://localhost:8000${prod.image}`
                                                            : "/Image/no-image.png"
                                                    }
                                                    alt={prod.name}
                                                    className="product-img"
                                                />
                                            </td>

                                            <td>{prod.name}</td>
                                            <td>{formatVND(prod.price)}</td>
                                            <td>{prod.description || "Không có mô tả"}</td>

                                            <td>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() =>
                                                        navigate(`/admin/products/edit/${prod.id}`)
                                                    }
                                                >
                                                    Sửa
                                                </button>

                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(prod.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* pagination */}
                            <div className="pagination">
                                {[...Array(pagination.last_page)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={
                                            pagination.current_page === i + 1 ? "active" : ""
                                        }
                                        onClick={() => fetchProducts(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
