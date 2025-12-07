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

    const token = localStorage.getItem("token");
    // Lấy dữ liệu danh mục
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:8000/api/categories",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            let data = res.data.data;
            // per_page = all → API trả về mảng trực tiếp
            // per_page default → API trả về dạng { categories: [. ..], pagination: {}}
            const list = Array.isArray(data) ? data : data.categories;
            list.sort((a, b) => a.id - b.id); // sắp xếp tăng dần theo id
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

    // Xử lý (Thêm hoặc Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("description", formData.description || "");
            if (formData.image) {
                form.append("image", formData.image); // chỉ thêm nếu có file
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // bắt buộc khi upload file
                },
            };
            if (editingCategory) {
                // Sửa danh mục
                await axios.post(
                    `http://localhost:8000/api/admin/categories/${editingCategory.id}`,
                    form,
                    config
                );
            } else {
                // Thêm danh mục
                await axios.post(
                    "http://localhost:8000/api/admin/categories",
                    form,
                    config
                );
            }

            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error("Lỗi khi lưu danh mục:", error);
            alert(error.response?.data?.message || "Đã xảy ra lỗi");
        }
    };


    // Xóa danh mục
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
                                                {cat.image
                                                    ? <img src={`http://localhost:8000${cat.image}`} alt={cat.name} className="category-img" />
                                                    : "Không có ảnh"}
                                            </td>

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
                            <label>Ảnh danh mục</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            />


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
