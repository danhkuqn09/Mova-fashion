import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/ProductView.css";

const ProductView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentPagination, setCommentPagination] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [reviewPagination, setReviewPagination] = useState(null);

    const [activeTab, setActiveTab] = useState("comments"); // ✅ TAB

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString("vi-VN") + "₫";

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("/");
        return `${day}/${month}/${year} ${timePart || ""}`;
    };

    useEffect(() => {
        fetchProduct();
        fetchComments(1);
        fetchReviews(1);
        // eslint-disable-next-line
    }, [id]);

    // ===== API =====
    const fetchProduct = async () => {
        const res = await axios.get(
            `http://localhost:8000/api/products/${id}`
        );
        setProduct(res.data.data);
    };

    const fetchComments = async (page = 1) => {
        const res = await axios.get(
            `http://localhost:8000/api/products/${id}/comments`,
            { params: { page } }
        );
        setComments(res.data.data.comments || []);
        setCommentPagination(res.data.data.pagination);
    };

    const fetchReviews = async (page = 1) => {
        const res = await axios.get(
            `http://localhost:8000/api/reviews`,
            { params: { product_id: id, page } }
        );
        setReviews(res.data.data.reviews || []);
        setReviewPagination(res.data.data.pagination);
    };

    if (!product) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="admin-container">
            <Sidebar />

            <div className="admin-main">
                <Topbar />

                <div className="admin-page product-view">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        ⬅ Quay lại
                    </button>
                    <h1>Chi tiết sản phẩm</h1>

                    <div className="product-view-card">
                        <img
                            src={
                                product.image
                                    ? `http://localhost:8000${product.image}`
                                    : "/Image/no-image.png"
                            }
                            alt={product.name}
                            className="product-view-img"
                        />

                        <div className="product-view-info">
                            <h2>{product.name}</h2>

                            <p className="price">
                                {product.sale_price ? (
                                    <>
                                        <del>{formatPrice(product.price)}</del>
                                        <br />
                                        <strong className="sale">
                                            {formatPrice(product.sale_price)}
                                        </strong>
                                    </>
                                ) : (
                                    formatPrice(product.price)
                                )}
                            </p>

                            <p>
                                <strong>Mô tả:</strong>{" "}
                                {product.description || "Không có mô tả"}
                            </p>

                            {/* tab bình luận 9đánh giá*/}
                            <div className="tabs">
                                <button
                                    className={activeTab === "comments" ? "active" : ""}
                                    onClick={() => setActiveTab("comments")}
                                >
                                    Bình luận ({commentPagination?.total || 0})
                                </button>

                                <button
                                    className={activeTab === "reviews" ? "active" : ""}
                                    onClick={() => setActiveTab("reviews")}
                                >
                                    Đánh giá ({reviewPagination?.total || 0})
                                </button>
                            </div>

                            {/* ===== TAB CONTENT ===== */}
                            {activeTab === "comments" && (
                                <>
                                    {comments.length === 0 ? (
                                        <p>Chưa có bình luận</p>
                                    ) : (
                                        <ul className="comment-list">
                                            {comments.map((c) => (
                                                <li key={c.id} className="comment-item">
                                                    <strong>{c.user?.name || "Ẩn danh"}</strong>
                                                    <p>{c.content}</p>
                                                    <small>{formatDate(c.created_at)}</small>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {commentPagination?.last_page > 1 && (
                                        <div className="pagination">
                                            {[...Array(commentPagination.last_page)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    className={
                                                        commentPagination.current_page === i + 1
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() => fetchComments(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === "reviews" && (
                                <>
                                    {reviews.length === 0 ? (
                                        <p>Chưa có đánh giá</p>
                                    ) : (
                                        <ul className="review-list">
                                            {reviews.map((r) => {
                                                const rating = Number(r.rating) || 0;

                                                return (
                                                    <li key={r.id} className="review-item">
                                                        <strong>{r.user?.name || "Ẩn danh"}</strong>

                                                        <div className="rating">
                                                            {"★".repeat(rating)}
                                                            {"☆".repeat(5 - rating)}
                                                        </div>

                                                        <p>{r.content}</p>

                                                        {r.image && (
                                                            <div className="review-images">
                                                                <img
                                                                    src={`http://localhost:8000${r.image}`}
                                                                    className="review-img"
                                                                    alt="review"
                                                                />
                                                            </div>
                                                        )}

                                                        <small>{formatDate(r.created_at)}</small>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                    {reviewPagination?.last_page > 1 && (
                                        <div className="pagination">
                                            {[...Array(reviewPagination.last_page)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    className={
                                                        reviewPagination.current_page === i + 1
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() => fetchReviews(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
