import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/AddProduct.css";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        sale_price: "",
        tag: "",
        category_id: "",
        image: null,
    });

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("description", formData.description);
            form.append("price", formData.price);

            if (formData.sale_price) form.append("sale_price", formData.sale_price);
            if (formData.tag) form.append("tag", formData.tag);

            form.append("category_id", formData.category_id);
            if (formData.image) form.append("image", formData.image);

            await axios.post("http://localhost:8000/api/admin/products", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                
            });

            alert("Thêm sản phẩm thành công!");
            window.location.href = "/admin/products";

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra");
            console.log(error.response.data);

        }
    };

    return (
        <div className="admin-container">
            <Sidebar />

            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <h1 className="page-title">➕ Thêm sản phẩm</h1>

                    <form className="add-product-form" onSubmit={handleSubmit}>
                        
                        <div className="form-group">
                            <label>Tên sản phẩm</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="two-col">
                            <div className="form-group">
                                <label>Giá</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Giá khuyến mãi</label>
                                <input
                                    type="number"
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="two-col">
                            <div className="form-group">
                                <label>Tag</label>
                                <select
                                    value={formData.tag}
                                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                >
                                    <option value="">-- Chọn tag --</option>
                                    <option value="new">New</option>
                                    <option value="hot">Hot</option>
                                    <option value="sale">Sale</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>ID danh mục</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Ảnh sản phẩm</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            />
                        </div>

                        <button className="save-btn" type="submit">
                            Lưu sản phẩm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
