import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Product.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    //   const [formData, setFormData] = useState({ name: "", description: "" });

    // 🧠 Lấy dữ liệu sản phẩm
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8000/api/products");
            console.log("Dữ liệu trả về:", res.data); // 👈 Thêm dòng này

            const data = res.data?.data?.data || [];

            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <h1>Quản lý sản phẩm</h1>

                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((prod) => (
                                        <tr key={prod.id}>
                                            <td>{prod.id}</td>
                                            <td><img
                                                src={
                                                    prod.image
                                                        ? `http://localhost:8000/storage/${prod.image}`
                                                        : "/Image/no-image.png"
                                                }
                                                alt={prod.name}
                                            /></td>

                                            <td>{prod.name}</td>
                                            <td>{prod.price}₫</td>
                                            <td>{prod.description || "Không có mô tả"}</td>
                                            <td>
                                                <button className="btn-edit">Sửa</button>
                                                <button className="btn-delete">Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Không có sản phẩm nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
