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
        // Loại bỏ tất cả ký tự không phải số trước khi format
        const numValue = String(value).replace(/\D/g, "");
        if (!numValue) return "";
        return Number(numValue).toLocaleString("vi-VN");
    };

    // Parse giá từ format về number
    const parsePrice = (value) => {
        return String(value).replace(/\D/g, "");
    };

    // Load chi tiết sản phẩm
    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/products/${id}`);
            const prod = res.data.data;

            setFormData({
                name: prod.name,
                description: prod.description || "",
                price: String(Math.floor(parseFloat(prod.price) || 0)),
                sale_price: prod.sale_price ? String(Math.floor(parseFloat(prod.sale_price))) : "",
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
                            size: v.size,
                            quantity: v.quantity,
                            price: v.price ? String(Math.floor(parseFloat(v.price))) : "",
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

        // Giới hạn giá tối đa (do database chỉ hỗ trợ decimal(10,2) = tối đa 99,999,999.99)
        const MAX_PRICE = 99999999;

        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("description", formData.description);
            
            // Parse price về số nguyên và validate
            const priceValue = parseInt(String(formData.price).replace(/\D/g, '')) || 0;
            
            // Kiểm tra giá vượt quá giới hạn
            if (priceValue > MAX_PRICE) {
                alert(`❌ Giá không được vượt quá ${formatPrice(MAX_PRICE)} VND`);
                return;
            }
            
            form.append("price", priceValue);
            
            if (formData.sale_price) {
                const salePriceValue = parseInt(String(formData.sale_price).replace(/\D/g, '')) || 0;
                
                // Kiểm tra giá sale vượt quá giới hạn
                if (salePriceValue > MAX_PRICE) {
                    alert(`❌ Giá khuyến mãi không được vượt quá ${formatPrice(MAX_PRICE)} VND`);
                    return;
                }
                
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

            // VARIANTS (không cần gửi id nữa vì backend sẽ tạo mới tất cả)
            formData.variants.forEach((v, index) => {
                form.append(`variants[${index}][size]`, v.size);
                form.append(`variants[${index}][quantity]`, v.quantity);
                if (v.price) {
                    const variantPrice = parseInt(String(v.price).replace(/\D/g, '')) || 0;
                    
                    // Kiểm tra giá biến thể
                    if (variantPrice > MAX_PRICE) {
                        alert(`❌ Giá biến thể ${v.size} không được vượt quá ${formatPrice(MAX_PRICE)} VND`);
                        throw new Error('Price limit exceeded');
                    }
                    
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
                { size: "", quantity: 0, price: "", color_index: 0 },
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
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">
                            <i className="fas fa-edit text-warning me-2"></i>
                            Chỉnh sửa sản phẩm
                        </h1>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/admin/products")}
                        >
                            <i className="fas fa-arrow-left me-2"></i>Quay lại
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Thông tin cơ bản */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0">
                                    <i className="fas fa-info-circle me-2" style={{ color: '#3498db' }}></i>
                                    Thông tin cơ bản
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Tên sản phẩm <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Mô tả</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Giá gốc (₫) <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required
                                            value={formatPrice(formData.price)}
                                            onChange={(e) => setFormData({ ...formData, price: parsePrice(e.target.value) })}
                                        />
                                        <small className="text-muted">Giá tối đa: 99,999,999 VND</small>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Giá khuyến mãi (₫)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formatPrice(formData.sale_price)}
                                            onChange={(e) => setFormData({ ...formData, sale_price: parsePrice(e.target.value) })}
                                        />
                                        <small className="text-muted">Giá tối đa: 99,999,999 VND</small>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Tag</label>
                                        <select
                                            className="form-select"
                                            value={formData.tag}
                                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        >
                                            <option value="">-- Chọn tag --</option>
                                            <option value="new">New</option>
                                            <option value="hot">Hot</option>
                                            <option value="sale">Sale</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Danh mục <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
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

                                <div className="mb-0">
                                    <label className="form-label fw-semibold">Ảnh sản phẩm (nếu muốn đổi)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Màu sắc */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0">
                                    <i className="fas fa-palette me-2" style={{ color: '#e67e22' }}></i>
                                    Danh sách màu sắc ({formData.colors.length})
                                </h5>
                            </div>
                            <div className="card-body">
                                {formData.colors.map((c, index) => (
                                    <div key={index} className="border rounded p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-4">
                                                <label className="form-label small mb-1">Tên màu</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Vd: Đỏ, Xanh..."
                                                    value={c.name}
                                                    onChange={(e) => {
                                                        const arr = [...formData.colors];
                                                        arr[index].name = e.target.value;
                                                        setFormData({ ...formData, colors: arr });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label small mb-1">Mã màu</label>
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color w-100"
                                                    value={c.color_code}
                                                    onChange={(e) => {
                                                        const arr = [...formData.colors];
                                                        arr[index].color_code = e.target.value;
                                                        setFormData({ ...formData, colors: arr });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label small mb-1">Ảnh màu (nếu đổi)</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const arr = [...formData.colors];
                                                        arr[index].image = e.target.files[0];
                                                        setFormData({ ...formData, colors: arr });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm w-100 mt-4"
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            colors: formData.colors.filter((_, i) => i !== index),
                                                        });
                                                    }}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            colors: [...formData.colors, { name: "", color_code: "#000000", image: null }],
                                        })
                                    }
                                >
                                    <i className="fas fa-plus me-2"></i>Thêm màu
                                </button>
                            </div>
                        </div>

                        {/* Biến thể */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className="fas fa-boxes me-2" style={{ color: '#27ae60' }}></i>
                                        Danh sách biến thể
                                    </h5>
                                    <div>
                                        <span className="badge bg-primary me-2">{formData.variants.length} biến thể</span>
                                        <span className="badge bg-success">Tổng SL: {formData.variants.reduce((sum, v) => sum + (parseInt(v.quantity) || 0), 0)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {formData.variants.map((v, index) => (
                                    <div key={index} className="border rounded p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-2">
                                                <label className="form-label small mb-1">Size</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="S, M, L..."
                                                    value={v.size}
                                                    onChange={(e) => {
                                                        const arr = [...formData.variants];
                                                        arr[index].size = e.target.value;
                                                        setFormData({ ...formData, variants: arr });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <label className="form-label small mb-1">Số lượng</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="0"
                                                    value={v.quantity}
                                                    onChange={(e) => {
                                                        const arr = [...formData.variants];
                                                        arr[index].quantity = e.target.value;
                                                        setFormData({ ...formData, variants: arr });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label small mb-1">Giá riêng (tùy chọn)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Để trống nếu dùng giá chung"
                                                    value={formatPrice(v.price)}
                                                    onChange={(e) => {
                                                        const arr = [...formData.variants];
                                                        arr[index].price = parsePrice(e.target.value);
                                                        setFormData({ ...formData, variants: arr });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label small mb-1">Màu sắc</label>
                                                <select
                                                    className="form-select"
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
                                            </div>

                                            <div className="col-md-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm w-100 mt-4"
                                                    onClick={() =>
                                                        setFormData({
                                                            ...formData,
                                                            variants: formData.variants.filter((_, i) => i !== index),
                                                        })
                                                    }
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            variants: [...formData.variants, { size: "", quantity: 0, price: "", color_index: 0 }],
                                        })
                                    }
                                >
                                    <i className="fas fa-plus me-2"></i>Thêm biến thể
                                </button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3">
                            <button
                                type="button"
                                className="btn btn-secondary px-4"
                                onClick={() => navigate("/admin/products")}
                            >
                                <i className="fas fa-times me-2"></i>Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-warning px-4"
                            >
                                <i className="fas fa-save me-2"></i>Cập nhật sản phẩm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
