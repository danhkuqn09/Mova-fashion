import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./ReviewDetail.css";

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchReviewDetail = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/admin/reviews/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewDetail();
  }, []);

  if (loading) return <p>Đang tải chi tiết...</p>;
  if (!review) return <p>Không tìm thấy đánh giá.</p>;

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />

        <div className="admin-page">
          <h2>Chi tiết đánh giá #{review.id}</h2>

          <Link to="/admin/reviews" className="back-btn">← Quay lại</Link>

          <div className="review-detail-box">
            <p><strong>Người dùng:</strong> {review.user.name}</p>
            <p><strong>Email:</strong> {review.user.email}</p>

            <p><strong>Sản phẩm:</strong> {review.product.name}</p>
            <img
              src={`http://localhost:8000${review.product.image}`}
              className="review-product-image"
            />

            <p><strong>Số sao:</strong> {review.rating} ⭐</p>
            <p><strong>Nội dung:</strong> {review.content}</p>
            <p><strong>Ngày tạo:</strong> {review.created_at}</p>

            <h3>Hình ảnh đánh giá</h3>
            {review.images?.length > 0 ? (
              <div className="review-detail-images">
                {review.images.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:8000/storage/reviews/${img}`}
                    className="review-image-item"
                  />
                ))}
              </div>
            ) : (
              <p>Không có hình ảnh.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
