import React, { useState, useEffect } from "react";
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

    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem("token");

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
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">
                            <i className="fas fa-plus-circle text-primary me-2"></i>
                            Thêm sản phẩm mới
                        </h1>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => window.history.back()}
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
                                        placeholder="Nhập tên sản phẩm..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Mô tả</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Nhập mô tả sản phẩm..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
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
                                            placeholder="Nhập giá sản phẩm..."
                                            value={formatPrice(formData.price)}
                                            onChange={(e) => setFormData({ ...formData, price: parsePrice(e.target.value) })}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Giá khuyến mãi (₫)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập giá khuyến mãi..."
                                            value={formatPrice(formData.sale_price)}
                                            onChange={(e) => setFormData({ ...formData, sale_price: parsePrice(e.target.value) })}
                                        />
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
                                    <label className="form-label fw-semibold">Ảnh sản phẩm</label>
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
                                    Danh sách màu sắc
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
                                                <label className="form-label small mb-1">Ảnh màu</label>
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
                                onClick={() => window.history.back()}
                            >
                                <i className="fas fa-times me-2"></i>Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                            >
                                <i className="fas fa-save me-2"></i>Lưu sản phẩm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
