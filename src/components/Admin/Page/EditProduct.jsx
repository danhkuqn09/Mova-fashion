import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./EditProduct.css";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

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

    // ================= LOAD PRODUCT =================
    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/products/${id}`);
            const prod = res.data.data;

            setFormData({
                name: prod.name,
                description: prod.description || "",
                price: prod.price || 0,
                sale_price: prod.sale_price || "",
                tag: prod.tag_id || "",
                category_id: prod.category?.id || "",
                image: null,

                // Load màu
                colors: prod.colors
                    ? prod.colors.map((c) => ({
                        name: c.name,
                        color_code: c.color_code,
                        image: null,
                    }))
                    : [],

                // Load variants
                variants: prod.variants
                    ? prod.variants.map((v) => ({
                        id: v.id,       // rất quan trọng khi edit
                        size: v.size,
                        quantity: v.quantity,
                        price: v.price,
                        color_index: v.color_index ?? 0,
                    }))
                    : [],
            });
        } catch (error) {
            console.error("Lỗi load sản phẩm:", error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();

            form.append("name", formData.name);
            form.append("description", formData.description);
            form.append("price", formData.price);
            form.append("sale_price", formData.sale_price);
            form.append("tag", formData.tag);
            form.append("category_id", formData.category_id);

            if (formData.image instanceof File) {
                form.append("image", formData.image);
            }

            // COLORS
            formData.colors.forEach((c, i) => {
                form.append(`colors[${i}][name]`, c.name);
                form.append(`colors[${i}][color_code]`, c.color_code);
                if (c.image instanceof File) {
                    form.append(`colors[${i}][image]`, c.image);
                }
            });

            // VARIANTS
            formData.variants.forEach((v, i) => {
                if (v.id) {
                    form.append(`variants[${i}][id]`, v.id); // chỉ gửi nếu có
                }

                form.append(`variants[${i}][size]`, v.size);
                form.append(`variants[${i}][quantity]`, v.quantity);
                form.append(`variants[${i}][price]`, v.price);
                form.append(`variants[${i}][color_index]`, v.color_index);
            });


            await axios.post(
                `http://localhost:8000/api/admin/products/${id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("✔ Sửa sản phẩm thành công!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Lỗi lưu:", error.response?.data);
            alert("❌ Lỗi khi sửa sản phẩm!");
        }
    };

    // ================= ADD / REMOVE COLORS =================
    const addColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: "", color_code: "#000000", image: null }],
        });
    };

    const removeColor = (idx) => {
        setFormData({
            ...formData,
            colors: formData.colors.filter((_, i) => i !== idx),
        });
    };

    // ================= ADD / REMOVE VARIANTS =================
    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { id: null, size: "", quantity: 0, price: "", color_index: 0 },
            ],
        });
    };

    const removeVariant = (idx) => {
        setFormData({
            ...formData,
            variants: formData.variants.filter((_, i) => i !== idx),
        });
    };

    // ===========================================================
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <h1>✏️ Sửa sản phẩm</h1>

                    <form className="edit-form" onSubmit={handleSubmit}>
                        {/* BASIC INFO */}
                        <label>Tên</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <label>Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />

                        <label>Giá</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({ ...formData, price: e.target.value })
                            }
                        />

                        <label>Giá khuyến mãi</label>
                        <input
                            type="number"
                            value={formData.sale_price}
                            onChange={(e) =>
                                setFormData({ ...formData, sale_price: e.target.value })
                            }
                        />

                        <label>ID danh mục</label>
                        <input
                            type="number"
                            value={formData.category_id}
                            onChange={(e) =>
                                setFormData({ ...formData, category_id: e.target.value })
                            }
                        />

                        {/* ================= COLORS ================= */}
                        <h3>🎨 Màu sắc</h3>

                        {formData.colors.map((c, index) => (
                            <div key={index} className="color-box">
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
                                    onChange={(e) => {
                                        const arr = [...formData.colors];
                                        arr[index].image = e.target.files[0];
                                        setFormData({ ...formData, colors: arr });
                                    }}
                                />

                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeColor(index)}
                                >
                                    ❌
                                </button>
                            </div>
                        ))}

                        <button type="button" className="add-btn" onClick={addColor}>
                            ➕ Thêm màu
                        </button>

                        <hr />

                        {/* ================= VARIANTS ================= */}
                        <h3>📦 Biến thể (Size – SL – Giá – Màu)</h3>

                        {formData.variants.map((v, index) => (
                            <div key={index} className="variant-box">
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
                                    onClick={() => removeVariant(index)}
                                >
                                    ❌
                                </button>
                            </div>
                        ))}

                        <button type="button" className="add-btn" onClick={addVariant}>
                            ➕ Thêm biến thể
                        </button>

                        <hr />

                        {/* IMAGE */}
                        <label>Ảnh mới (nếu muốn đổi)</label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setFormData({ ...formData, image: e.target.files[0] })
                            }
                        />

                        <button type="submit" className="save-btn">
                            Lưu sản phẩm
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/admin/products")}
                        >
                            Hủy
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
