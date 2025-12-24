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
        variants: [],
    });
    const [categories, setCategories] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const token = localStorage.getItem("token");

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
        axios.get("http://localhost:8000/api/admin/colors").then(res => setColorOptions(res.data.data || []));
        axios.get("http://localhost:8000/api/admin/sizes").then(res => setSizeOptions(res.data.data || []));
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

        // Kiểm tra biến thể
        for (let i = 0; i < formData.variants.length; i++) {
            const v = formData.variants[i];
            // Ép kiểu về số
            v.size_id = parseInt(v.size_id);
            v.color_id = parseInt(v.color_id);
            v.quantity = parseInt(v.quantity);
            if (v.price) v.price = parseInt(v.price);
            if (!v.size_id || !v.color_id || !v.quantity) {
                alert(`Biến thể thứ ${i + 1} thiếu size, màu hoặc số lượng!`);
                return;
            }
        }
        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("description", formData.description);
            form.append("price", formData.price);
            if (formData.sale_price) form.append("sale_price", formData.sale_price);
            if (formData.tag) form.append("tag", formData.tag);
            form.append("category_id", formData.category_id);
            if (formData.image) form.append("image", formData.image);
            // VARIANTS
            formData.variants.forEach((v, i) => {
                form.append(`variants[${i}][size_id]`, v.size_id);
                form.append(`variants[${i}][quantity]`, v.quantity);
                if (v.price) form.append(`variants[${i}][price]`, v.price);
                form.append(`variants[${i}][color_id]`, v.color_id);
            });
            const res = await axios.post("http://localhost:8000/api/admin/products", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Thêm sản phẩm thành công!");
            window.location.href = "/admin/products";
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message || "Có lỗi xảy ra");
            } else {
                alert("Có lỗi xảy ra");
            }
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
                        {/* Không nhập màu thủ công, dùng dropdown màu từ bảng chung */}

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
                                                <select
                                                    className="form-select"
                                                    value={v.size_id || ""}
                                                    onChange={e => {
                                                        const arr = [...formData.variants];
                                                        arr[index].size_id = e.target.value;
                                                        setFormData({ ...formData, variants: arr });
                                                    }}
                                                >
                                                    <option value="">--Chọn size--</option>
                                                    {sizeOptions.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
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
                                                    value={v.color_id || ""}
                                                    onChange={e => {
                                                        const arr = [...formData.variants];
                                                        arr[index].color_id = e.target.value;
                                                        setFormData({ ...formData, variants: arr });
                                                    }}
                                                >
                                                    <option value="">--Chọn màu--</option>
                                                    {colorOptions.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
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
                                            variants: [...formData.variants, { size_id: "", color_id: "", quantity: 0, price: "" }],
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
