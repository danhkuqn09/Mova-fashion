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
        colors: [],
        variants: [],
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

            // COLORS
            formData.colors.forEach((c, i) => {
                form.append(`colors[${i}][name]`, c.name);
                form.append(`colors[${i}][color_code]`, c.color_code);
                if (c.image instanceof File) form.append(`colors[${i}][image]`, c.image);
            });

            // VARIANTS
            formData.variants.forEach((v, i) => {
                form.append(`variants[${i}][size]`, v.size);
                form.append(`variants[${i}][quantity]`, v.quantity);
                if (v.price) form.append(`variants[${i}][price]`, v.price);
                form.append(`variants[${i}][color_index]`, v.color_index);
            });

            await axios.post("http://localhost:8000/api/admin/products", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Thêm sản phẩm thành công!");
            window.location.href = "/admin/products";
            
        } catch (error) {
            console.log(error.response.data);
            alert("Có lỗi xảy ra");
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
                        
                        {/* BASIC INFO */}
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

                        {/* COLORS */}
                        <h3 className="section-title">🎨 Danh sách màu</h3>

                        {formData.colors.map((c, index) => (
                            <div className="color-row" key={index}>
                                <input
                                    type="text"
                                    placeholder="Tên màu"
                                    value={c.name}
                                    onChange={(e) => {
                                        const arr = [...formData.colors];
                                        arr[index].name = e.target.value;
                                        setFormData({ ...formData, colors: arr });
                                    }}
                                />

                                <input
                                    type="color"
                                    value={c.color_code}
                                    onChange={(e) => {
                                        const arr = [...formData.colors];
                                        arr[index].color_code = e.target.value;
                                        setFormData({ ...formData, colors: arr });
                                    }}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const arr = [...formData.colors];
                                        arr[index].image = e.target.files[0];
                                        setFormData({ ...formData, colors: arr });
                                    }}
                                />

                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            colors: formData.colors.filter((_, i) => i !== index),
                                        });
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="add-small-btn"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    colors: [...formData.colors, { name: "", color_code: "#000000", image: null }],
                                })
                            }
                        >
                            + Thêm màu
                        </button>

                        {/* VARIANTS */}
                        <h3 className="section-title">📦 Danh sách biến thể</h3>

                        {formData.variants.map((v, index) => (
                            <div className="variant-row" key={index}>
                                <input
                                    type="text"
                                    placeholder="Size"
                                    value={v.size}
                                    onChange={(e) => {
                                        const arr = [...formData.variants];
                                        arr[index].size = e.target.value;
                                        setFormData({ ...formData, variants: arr });
                                    }}
                                />

                                <input
                                    type="number"
                                    placeholder="Số lượng"
                                    value={v.quantity}
                                    onChange={(e) => {
                                        const arr = [...formData.variants];
                                        arr[index].quantity = e.target.value;
                                        setFormData({ ...formData, variants: arr });
                                    }}
                                />

                                <input
                                    type="number"
                                    placeholder="Giá riêng"
                                    value={v.price}
                                    onChange={(e) => {
                                        const arr = [...formData.variants];
                                        arr[index].price = e.target.value;
                                        setFormData({ ...formData, variants: arr });
                                    }}
                                />

                                <select
                                    value={v.color_index}
                                    onChange={(e) => {
                                        const arr = [...formData.variants];
                                        arr[index].color_index = e.target.value;
                                        setFormData({ ...formData, variants: arr });
                                    }}
                                >
                                    {formData.colors.map((c, i) => (
                                        <option key={i} value={i}>
                                            {c.name || `Màu ${i + 1}`}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            variants: formData.variants.filter((_, i) => i !== index),
                                        })
                                    }
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="add-small-btn"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    variants: [...formData.variants, { size: "", quantity: 0, price: "", color_index: 0 }],
                                })
                            }
                        >
                            + Thêm biến thể
                        </button>

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
