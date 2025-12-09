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
        variants: []
    });

    // Load chi tiết sản phẩm
    const fetchProduct = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/products/${id}`);
            const prod = res.data.data;

            setFormData({
                name: prod.name,
                description: prod.description || "",
                price: prod.price,
                sale_price: prod.sale_price,
                tag: prod.tag_id || "",
                category_id: prod.category?.id || "",
                image: null,

                colors: prod.colors
                    ? prod.colors.map(c => ({
                        name: c.name,
                        color_code: c.color_code,
                        image: null
                    }))
                    : [],

                variants: prod.variants
                    ? prod.variants.map(v => ({
                        id: v.id,
                        size: v.size,
                        quantity: v.quantity,
                        price: v.price,
                        color_index: 0
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

            formData.colors.forEach((c, index) => {
                form.append(`colors[${index}][name]`, c.name);
                form.append(`colors[${index}][color_code]`, c.color_code);
                if (c.image instanceof File) form.append(`colors[${index}][image]`, c.image);
            });

            formData.variants.forEach((v, index) => {
                form.append(`variants[${index}][id]`, v.id);
                form.append(`variants[${index}][size]`, v.size);
                form.append(`variants[${index}][quantity]`, v.quantity);
                form.append(`variants[${index}][price]`, v.price);
                form.append(`variants[${index}][color_index]`, v.color_index);
            });

            await axios.post(
                `http://localhost:8000/api/admin/products/${id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("✔ Sửa sản phẩm thành công!");
            navigate("/admin/products");

        } catch (error) {
            console.error("Lỗi lưu:", error.response?.data);
            alert("Lỗi khi sửa sản phẩm!");
        }
    };

    // if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <h1>✏️ Sửa sản phẩm</h1>

                    <form className="edit-form" onSubmit={handleSubmit}>
                        <label>Tên</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
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

                        <label>Danh mục ID</label>
                        <input
                            type="number"
                            value={formData.category_id}
                            onChange={(e) =>
                                setFormData({ ...formData, category_id: e.target.value })
                            }
                        />

                        <label>Ảnh mới (nếu muốn đổi)</label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setFormData({ ...formData, image: e.target.files[0] })
                            }
                        />

                        <button type="submit" className="save-btn">Lưu sản phẩm</button>
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
