import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review state
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Load order detail
  useEffect(() => {
    const fetchOrderDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://localhost:8000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // Load all reviews for the product
  useEffect(() => {
    const fetchProductReviews = async () => {
      if (!order) return;
      setLoadingReviews(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/reviews?product_id=${order.items[0].product.id}`
        );
        const productReviews = res.data.data?.reviews || [];
        setReviews(productReviews);
      } catch (err) {
        console.log("Lỗi tải review sản phẩm:", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchProductReviews();
  }, [order]);

  // Check if user already reviewed this order
  useEffect(() => {
    const fetchMyReview = async () => {
      if (!order) return;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/api/reviews/my-reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myReviews = res.data.data || [];
        const reviewed = myReviews.some(r => r.order_id === order.id);
        setAlreadyReviewed(reviewed);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMyReview();
  }, [order]);

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập để đánh giá!");
    if (!reviewContent.trim()) return alert("Vui lòng nhập nội dung đánh giá!");
    if (alreadyReviewed) return alert("Bạn chỉ được đánh giá sản phẩm này 1 lần!");

    try {
      const formData = new FormData();
      formData.append("order_item_id", order.items[0].id);
      formData.append("rating", rating || 5);
      formData.append("content", reviewContent);
      if (reviewImage) formData.append("image", reviewImage);

      const res = await axios.post(
        "http://localhost:8000/api/reviews",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newReview = {
          ...res.data.data,
          user: { name: order.customer_info?.name || "Bạn", avatar: null },
        };
        setReviews(prev => [...prev, newReview]);
        setAlreadyReviewed(true);
        setRating(0);
        setReviewContent("");
        setReviewImage(null);
        alert("Gửi đánh giá thành công!");
      }
    } catch (err) {
      // Lấy thông báo lỗi từ server nếu có
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        console.log(err);
        alert("Gửi đánh giá thất bại!");
      }
    }
  };



  if (loading) return <div className="loading">Đang tải chi tiết...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="order-detail-container">
      <Link to="/order" className="back-link">← Quay lại danh sách</Link>

      <div className="order-header">
        <h2>Chi tiết đơn hàng #{order.id}</h2>
        <span className={`status-badge ${order.status}`}>
          {order.status_text || order.status}
        </span>
      </div>

      <div className="order-info-grid">
        <div className="info-col">
          <h3>Thông tin người nhận</h3>
          <p><strong>Họ tên:</strong> {order.customer_info?.name}</p>
          <p><strong>Số điện thoại:</strong> {order.customer_info?.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.customer_info?.address}</p>
        </div>
        <div className="info-col">
          <h3>Thông tin đơn hàng</h3>
          <p><strong>Mã đơn:</strong> {order.order_code}</p>
          <p><strong>Ngày đặt:</strong> {order.created_at}</p>
          <p><strong>Thanh toán:</strong> {order.payment_method_text} ({order.payment_status})</p>
        </div>
      </div>

      <h3>Sản phẩm đã đặt</h3>
      <div className="table-responsive">
        <table className="detail-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map(item => (
              <tr key={item.id}>
                <td>
                  {item.product.image && <img src={`http://localhost:8000${item.product.image}`} alt={item.product.name} className="product-image" />}
                </td>
                <td>{item.product.name}<br />Size: {item.variant?.size || "Không có"}<br />Màu: {item.variant?.color || "Không có"}</td>
                <td>{Number(item.price).toLocaleString("vi-VN")} ₫</td>
                <td>{item.quantity}</td>
                <td>{Number(item.subtotal).toLocaleString("vi-VN")} ₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-summary">
        {order.pricing?.discount_amount > 0 && (
          <div className="summary-row discount">
            <span>Giảm giá:</span>
            <span>-{Number(order.pricing.discount_amount).toLocaleString("vi-VN")} ₫</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Tổng cộng:</span>
          <span>{Number(order.pricing?.final_total).toLocaleString("vi-VN")} ₫</span>
        </div>
      </div>

      {/* Review section */}
      {order.status === "completed" && (
        <div className="order-review">
          <h3>Đánh giá sản phẩm</h3>

          {!alreadyReviewed && (
            <div className="review-form">
              <p>Chọn số sao (mặc định 5 nếu không chọn):</p>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} onClick={() => setRating(s)} style={{ cursor: "pointer", color: s <= rating ? "gold" : "#ccc", fontSize: 24 }}>★</span>
                ))}
              </div>
              <textarea value={reviewContent} onChange={e => setReviewContent(e.target.value)} placeholder="Nhập nội dung đánh giá..." />
              <input type="file" onChange={e => setReviewImage(e.target.files[0])} />
              <button onClick={handleSubmitReview}>Gửi đánh giá</button>
            </div>
          )}
          {alreadyReviewed && <p style={{ color: "green" }}>Bạn đã đánh giá đơn hàng này.</p>}

          {loadingReviews ? <p>Đang tải đánh giá...</p> :
            <div className="review-list">
              {reviews.map(r => (
                <div key={r.id} className="review-item">
                  <strong>{r.user?.name || "Người dùng"}</strong>
                  <div className="stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <p>{r.content}</p>
                  {r.image && <img src={`http://localhost:8000${r.image}`} alt="review" className="review-image" />}
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
