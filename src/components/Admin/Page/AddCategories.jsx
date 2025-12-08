import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Categories.css";
import { useNavigate } from "react-router-dom";

const AddCategories = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        name: "",
        description: "",
        image: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            if (form.image) {
                formData.append("image", form.image);
            }

            await axios.post(
                "http://localhost:8000/api/admin/categories",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Thêm danh mục thành công!");
            navigate("/admin/categories"); // quay lại danh sách
        } catch (error) {
            console.error("Lỗi thêm danh mục:", error);
            alert(error.response?.data?.message || "Không thể thêm danh mục");
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <h1>➕ Thêm Danh Mục</h1>

                    <div className="category-form-page">
                        <form onSubmit={handleSubmit}>
                            
                            <div className="form-group">
                                <label>Tên danh mục</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Ảnh danh mục</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setForm({ ...form, image: e.target.files[0] })
                                    }
                                />
                            </div>

                            <div className="form-buttons">
                                <button type="submit">Lưu</button>
                                <button type="button" onClick={() => navigate(-1)}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddCategories;
