import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Product.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    });
    const token = localStorage.getItem("token");

    // Lấy danh sách sản phẩm
    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8000/api/products", {
                params: { page, per_page: pagination.per_page },
            });

            const data = res.data.data;

            // Lấy danh sách sản phẩm
            const list = data.products || [];

            setProducts(list);

            // Lấy pagination từ API
            setPagination({
                current_page: data.pagination.current_page,
                last_page: data.pagination.last_page,
                total: data.pagination.total,
                per_page: data.pagination.per_page,
            });

        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Mở modal
    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price || "",
                sale_price: product.sale_price || "",
                tag: product.tag_id || "",
                category_id: product.category?.id || "",
                image: null,
                colors: product.colors
                    ? product.colors.map(c => ({
                        name: c.name,
                        color_code: c.color_code || "#000000",
                        image: null
                    }))
                    : [],

                variants: product.variants
                    ? product.variants.map(v => ({
                        size: v.size,
                        quantity: v.quantity,
                        price: v.price,
                    }))
                    : [],
            });
        } else {
            setEditingProduct(null);
            setFormData({
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
        }
        setShowModal(true);
    };

    // Submit thêm hoặc sửa
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();

            form.append("name", formData.name);
            form.append("description", formData.description || "");
            form.append("price", formData.price);
            if (formData.sale_price) form.append("sale_price", formData.sale_price);
            if (formData.tag) form.append("tag", formData.tag);
            form.append("category_id", formData.category_id);

            if (formData.image instanceof File) {
                form.append("image", formData.image);
            }

            //Colors (mảng) - handleSubmit
            formData.colors.forEach((c, index) => {
                form.append(`colors[${index}][name]`, c.name);
                form.append(`colors[${index}][color_code]`, c.color_code || "#000000");
                if (c.image instanceof File) {
                    form.append(`colors[${index}][image]`, c.image);
                }

            });

            //  Variants (mảng)
            formData.variants.forEach((v, index) => {
                form.append(`variants[${index}][size]`, v.size);
                form.append(`variants[${index}][quantity]`, v.quantity);
                if (v.price) form.append(`variants[${index}][price]`, v.price);
                form.append(`variants[${index}][color_index]`, v.color_index);
            });

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            if (editingProduct) {
                await axios.post(
                    `http://localhost:8000/api/admin/products/${editingProduct.id}`,
                    form,
                    config
                );
            } else {
                await axios.post("http://localhost:8000/api/admin/products", form, config);
            }

            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error("❌ Lỗi khi lưu sản phẩm:", error.response?.data);
            alert(JSON.stringify(error.response?.data, null, 2));

        }
    };

    // Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm?")) return;

        try {
            await axios.delete(
                `http://localhost:8000/api/admin/products/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error.response?.data);
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
                        <h1>Quản lý sản phẩm</h1>
                        <button className="add-btn" onClick={() => openModal()}>
                            ➕ Thêm sản phẩm
                        </button>
                    </div>

                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Hình ảnh</th>
                                        <th>Tên</th>
                                        <th>Giá</th>
                                        <th>Mô tả</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map((prod) => (
                                        <tr key={prod.id}>
                                            <td>{prod.id}</td>
                                            <td>
                                                <img
                                                    src={
                                                        prod.image
                                                            ? `http://localhost:8000${prod.image}`
                                                            : "/Image/no-image.png"
                                                    }
                                                    alt={prod.name}
                                                    className="product-img"
                                                />
                                            </td>
                                            <td>{prod.name}</td>
                                            <td>{prod.price}₫</td>
                                            <td>{prod.description || "Không có mô tả"}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => openModal(prod)}>
                                                    Sửa
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(prod.id)}>
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination">
                                {[...Array(pagination.last_page)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={pagination.current_page === i + 1 ? "active" : ""}
                                        onClick={() => fetchProducts(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingProduct ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h2>

                        <form onSubmit={handleSubmit}>
                            <label>Tên sản phẩm</label>
                            <input
                                type="text"
                                value={formData.name}
                                required
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
                                required
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />

                            <label>Giá khuyến mãi</label>
                            <input
                                type="number"
                                value={formData.sale_price}
                                onChange={(e) =>
                                    setFormData({ ...formData, sale_price: e.target.value })
                                }
                            />

                            <label>Tag (ID)</label>
                            <select value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })}>
                                <option value="">-- Chọn tag --</option>
                                <option value="new">New</option>
                                <option value="hot">Hot</option>
                                <option value="sale">Sale</option>
                            </select>


                            <label>Danh mục ID</label>
                            <input
                                type="number"
                                value={formData.category_id}
                                required
                                onChange={(e) =>
                                    setFormData({ ...formData, category_id: e.target.value })
                                }
                            />

                            <label>Ảnh sản phẩm</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({ ...formData, image: e.target.files[0] })
                                }
                            />

                            {/* COLORS */}
                            {/* COLORS */}
                            <label>Danh sách màu</label>
                            {formData.colors.map((c, index) => (
                                <div className="color-row" key={index}>
                                    <input
                                        type="text"
                                        placeholder="Tên màu"
                                        value={c.color_name}
                                        onChange={(e) => {
                                            const updated = [...formData.colors];
                                            updated[index].name = e.target.value;
                                            setFormData({ ...formData, colors: updated });
                                        }}
                                    />

                                    <input
                                        type="color"
                                        value={c.color_code || "#000000"}
                                        onChange={(e) => {
                                            const updated = [...formData.colors];
                                            updated[index].color_code = e.target.value;
                                            setFormData({ ...formData, colors: updated });
                                        }}
                                    />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const updated = [...formData.colors];
                                            updated[index].image = e.target.files[0];
                                            setFormData({ ...formData, colors: updated });
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = formData.colors.filter((_, i) => i !== index);
                                            setFormData({ ...formData, colors: updated });
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
                            <label>Danh sách biến thể</label>
                            {formData.variants.map((v, index) => (
                                <div className="variant-row" key={index}>
                                    <input
                                        type="text"
                                        placeholder="Size (M, L, XL...)"
                                        value={v.size}
                                        onChange={(e) => {
                                            const updated = [...formData.variants];
                                            updated[index].size = e.target.value;
                                            setFormData({ ...formData, variants: updated });
                                        }}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Số lượng"
                                        value={v.quantity}
                                        onChange={(e) => {
                                            const updated = [...formData.variants];
                                            updated[index].quantity = e.target.value;
                                            setFormData({ ...formData, variants: updated });
                                        }}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Giá riêng (optional)"
                                        value={v.price}
                                        onChange={(e) => {
                                            const updated = [...formData.variants];
                                            updated[index].price = e.target.value;
                                            setFormData({ ...formData, variants: updated });
                                        }}
                                    />

                                    {/* Chọn màu cho biến thể */}
                                    <select
                                        value={v.color_index || 0}
                                        onChange={(e) => {
                                            const updated = [...formData.variants];
                                            updated[index].color_index = e.target.value;
                                            setFormData({ ...formData, variants: updated });
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
                                        onClick={() => {
                                            const updated = formData.variants.filter((_, i) => i !== index);
                                            setFormData({ ...formData, variants: updated });
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
                                        variants: [
                                            ...formData.variants,
                                            { size: "", quantity: 0, color_index: 0 },
                                        ],
                                    })
                                }
                            >
                                + Thêm biến thể
                            </button>


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

export default Products;
