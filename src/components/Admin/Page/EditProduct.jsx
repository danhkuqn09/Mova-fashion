import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/EditProduct.css";

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

    const [categories, setCategories] = useState([]);

    // Fetch danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/categories");
                const catData = res.data.data?.categories || res.data.categories || [];
                setCategories(catData);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // Format giá tiền VND
    const formatPrice = (value) => {
        if (!value) return "";
        return Number(value).toLocaleString("vi-VN");
    };

    // Parse giá từ format về number
    const parsePrice = (value) => {
        return value.replace(/\D/g, "");
    };

    // Load chi tiết sản phẩm
    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/products/${id}`);
            const prod = res.data.data;

            setFormData({
                name: prod.name,
                description: prod.description || "",
                price: prod.price,
                sale_price: prod.sale_price || "",
                tag: prod.tag_id || "",
                category_id: prod.category?.id || "",
                image: null,

                // Load màu
                colors: prod.colors
                    ? prod.colors.map((c) => ({
                        id: c.id,
                        name: c.name,
                        color_code: c.color_code || c.hex_code || "#000000",
                        image: null
                    }))
                    : [],


                // Load variants
                variants: prod.variants
                    ? prod.variants.map((v, idx) => {
                        // Tìm color_index dựa vào color_id
                        const colorIdx = prod.colors?.findIndex(c => c.id === v.color_id) ?? 0;
                        return {
                            id: v.id,
                            size: v.size,
                            quantity: v.quantity,
                            price: v.price || "",
                            color_index: colorIdx >= 0 ? colorIdx : 0
                        };
                    })
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
            
            // Parse price về số nguyên và validate
            let priceValue = typeof formData.price === 'string' 
                ? parsePrice(formData.price) 
                : formData.price;
            priceValue = Math.min(parseInt(priceValue) || 0, 2147483647);
            form.append("price", priceValue);
            
            if (formData.sale_price) {
                let salePriceValue = typeof formData.sale_price === 'string'
                    ? parsePrice(formData.sale_price)
                    : formData.sale_price;
                salePriceValue = Math.min(parseInt(salePriceValue) || 0, 2147483647);
                form.append("sale_price", salePriceValue);
            }
            
            form.append("tag", formData.tag);
            form.append("category_id", formData.category_id);

            if (formData.image instanceof File) {
                form.append("image", formData.image);
            }

            // COLORS
            formData.colors.forEach((c, i) => {
                if (c.id) {
                    form.append(`colors[${i}][id]`, c.id);
                }
                form.append(`colors[${i}][name]`, c.name);
                form.append(`colors[${i}][color_code]`, c.color_code);
                if (c.image instanceof File) {
                    form.append(`colors[${i}][image]`, c.image);
                }
            });

            formData.variants.forEach((v, index) => {
                if (v.id) form.append(`variants[${index}][id]`, v.id);
                form.append(`variants[${index}][size]`, v.size);
                form.append(`variants[${index}][quantity]`, v.quantity);
                if (v.price) {
                    const variantPrice = typeof v.price === 'string'
                        ? parsePrice(v.price)
                        : v.price;
                    form.append(`variants[${index}][price]`, variantPrice);
                }
                form.append(`variants[${index}][color_index]`, v.color_index);
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
            const errorMsg = error.response?.data?.message || "Lỗi khi sửa sản phẩm!";
            const errors = error.response?.data?.errors;
            if (errors) {
                const errorList = Object.entries(errors).map(([key, val]) => `${key}: ${val[0]}`).join("\n");
                alert(`Lỗi:\n${errorMsg}\n\n${errorList}`);
            } else {
                alert(errorMsg);
            }
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
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="two-col">
                            <div className="form-group">
                                <label>Giá (₫)</label>
                                <input
                                    type="text"
                                    required
                                    value={formatPrice(formData.price)}
                                    onChange={(e) => setFormData({ ...formData, price: parsePrice(e.target.value) })}
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Giá khuyến mãi (₫)</label>
                                <input
                                    type="text"
                                    value={formatPrice(formData.sale_price)}
                                    onChange={(e) => setFormData({ ...formData, sale_price: parsePrice(e.target.value) })}
                                    placeholder="0"
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
                                <label>Danh mục</label>
                                <select
                                    required
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {Array.isArray(categories) && categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Ảnh sản phẩm (nếu muốn đổi)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            />
                        </div>

                        {/* COLORS */}
                        <h3 className="section-title">🎨 Danh sách màu ({formData.colors.length})</h3>
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
                        <h3 className="section-title">📦 Danh sách biến thể ({formData.variants.length} biến thể, Tổng SL: {formData.variants.reduce((sum, v) => sum + (parseInt(v.quantity) || 0), 0)})</h3>
                        {formData.variants.map((v, index) => (
                            <div className="variant-row" key={index}>
                                <input
                                    type="text"
                                    placeholder="Size (S, M, L, XL...)"
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
                                    type="text"
                                    placeholder="Giá riêng (nếu có)"
                                    value={formatPrice(v.price)}
                                    onChange={(e) => {
                                        const arr = [...formData.variants];
                                        arr[index].price = parsePrice(e.target.value);
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

                        <div className="form-actions">
                            <button type="submit" className="save-btn">💾 Lưu sản phẩm</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/admin/products")}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
