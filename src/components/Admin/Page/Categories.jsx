import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Categories.css";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    // Lấy dữ liệu danh mục
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8000/api/categories");
            let data = [];
            if (Array.isArray(res.data)) data = res.data;
            else if (Array.isArray(res.data.data)) data = res.data.data;
            else if (Array.isArray(res.data.data?.products?.data))
                data = res.data.data.products.data;
            setCategories(data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Mở modal thêm hoặc sửa
    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || "" });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", description: "" });
        }
        setShowModal(true);
    };

    // Xử lý submit form (Thêm hoặc Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(
                    `http://localhost:8000/api/categories/${editingCategory.id}`,
                    formData
                );
            } else {
                await axios.post("http://localhost:8000/api/categories", formData);
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error("Lỗi khi lưu danh mục:", error);
        }
    };

    // Xóa danh mục
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await axios.delete(`http://localhost:8000/api/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
            }
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
                        <button className="add-btn" onClick={() => openModal()}>
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
                                                <button className="btn-edit" onClick={() => openModal(cat)}>Sửa</button>
                                                <button className="btn-delete" onClick={() => handleDelete(cat.id)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">Không có danh mục nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal thêm / sửa */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingCategory ? "✏️ Sửa Danh Mục" : "➕ Thêm Danh Mục"}</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Tên danh mục</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />

                            <label>Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            ></textarea>

                            <div className="modal-actions">
                                <button type="submit" className="save-btn">
                                    Lưu
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
