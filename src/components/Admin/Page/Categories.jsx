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
                    <div className="admin-header">
                        <h1>Quản lý Danh Mục</h1>

                        {/* CHUYỂN SANG TRANG ADD */}
                        <button className="add-btn" onClick={() => navigate("/admin/categories/add")}>
                            ➕ Thêm danh mục
                        </button>
                    </div>

                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên danh mục</th>
                                    <th>Mô tả</th>
                                    <th>Ảnh</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td>{cat.id}</td>
                                            <td>{cat.name}</td>
                                            <td>{cat.description || "Không có mô tả"}</td>
                                            <td>
                                                {cat.image ? (
                                                    <img
                                                        src={`http://localhost:8000${cat.image}`}
                                                        alt={cat.name}
                                                        className="category-img"
                                                    />
                                                ) : (
                                                    "Không có ảnh"
                                                )}
                                            </td>

                                            <td>
                                                {/* CHỈ SỬA, KHÔNG CÒN MODAL ADD */}
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => navigate(`/admin/categories/edit/${cat.id}`)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Không có danh mục nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
