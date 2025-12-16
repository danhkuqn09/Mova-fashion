import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Banner from "./Banner";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImg, setMainImg] = useState("");

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // 👉 Popup/Toast State
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'

  // 👉 Hàm hiển thị Popup/Toast
  const displayPopup = (message, type = "success", duration = 3000) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    // Tự động ẩn sau thời gian định sẵn
    setTimeout(() => {
      setShowPopup(false);
    }, duration);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        const data =
          res.data?.data?.product ||
          res.data?.data ||
          res.data.product ||
          res.data;

        setProduct(data);
        console.log("Product data:", data);
        console.log("Category:", data.category);
        
        if (data.image) {
          const imgUrl = data.image.startsWith('http') ? data.image : `http://localhost:8000${data.image}`;
          setMainImg(imgUrl);
        }
        
        // Lấy sản phẩm liên quan theo danh mục
        if (data.category?.id) {
          fetchRelatedProducts(data.category.id, id);
        } else {
          console.warn("Không có category trong product data");
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 🔗 Lấy sản phẩm liên quan
  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      console.log("Fetching related products for category:", categoryId);
      const res = await axios.get(`http://localhost:8000/api/products/category/${categoryId}`);
      console.log("API Response:", res.data);
      const productsData = res.data?.data?.products?.data || [];
      console.log("Products data:", productsData);
      // Lọc bỏ sản phẩm hiện tại và chỉ lấy 8 sản phẩm
      const filtered = productsData.filter(p => p.id !== parseInt(currentProductId)).slice(0, 8);
      console.log("Filtered related products:", filtered);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm liên quan:", error);
    }
  };

  // chỉnh số lượng
  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const formatVND = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + "₫";

  // Hàm xử lý URL ảnh
  const normalizeImage = (img) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/storage")) return `http://localhost:8000${img}`;
    if (img.startsWith("storage/")) return `http://localhost:8000/${img}`;
    return `http://localhost:8000/storage/${img}`;
  };

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;

    const variant = product.variants.find(
      (v) => v.size === selectedSize && v.color_id === selectedColor.id
    );

    return variant;
  }, [product, selectedColor, selectedSize]);

  // 👉 Thay thế alert bằng displayPopup
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      displayPopup("Vui lòng chọn màu và size trước khi thêm vào giỏ!", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", `/productdetail/${id}`);
      displayPopup("Bạn cần đăng nhập để thêm vào giỏ hàng!", "error", 5000);
      setTimeout(() => {
        navigate("/login");
      }, 500);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/cart",
        {
          product_variant_id: selectedVariant.id,
          quantity: quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        displayPopup("✅ Đã thêm sản phẩm vào giỏ hàng!", "success");
        // Phát sự kiện để cập nhật số lượng giỏ hàng ở Header
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        displayPopup(res.data?.message || "Không thể thêm sản phẩm!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data || error);
      if (error.response?.status === 401) {
        localStorage.setItem("redirectAfterLogin", `/productdetail/${id}`);
        displayPopup("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!", "error", 5000);
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        displayPopup("Thêm sản phẩm thất bại!", "error");
      }
    }
  };

  // mua ngay
  const handleBuyNow = () => {
    if (!selectedVariant) {
      displayPopup("Vui lòng chọn màu và size trước khi mua!", "error");
      return;
    }

    const item = {
      product_variant_id: selectedVariant.id,
      name: product.name,
      product: product,
      quantity: quantity,
      price: selectedVariant.sale_price || selectedVariant.price || product.price,
      image: selectedVariant.image || selectedColor?.image || product.image,
      color: selectedVariant.color?.name || selectedColor?.name || null,
      size: selectedVariant.size || null,
    };

    navigate("/checkout", {
      state: {
        buyNow: true,
        item,
        subtotal: item.price * quantity,
      },
    });
  };

  // Lấy bình luận
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await axios.get(`http://localhost:8000/api/products/${id}/comments`);
      const data = res.data?.data?.comments || [];
      console.log("COMMENTS RAW:", res.data);

      setComments(data);
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Lấy đánh giá
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(`http://localhost:8000/api/reviews?product_id=${id}`);
      const data = res.data?.data?.reviews?.data || res.data?.data?.reviews || [];
      console.log("REVIEWS RAW:", res.data);
      setReviews(data);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  //Load bình luận,review sau khi sản phẩm load xong
  useEffect(() => {
    if (product) {
      fetchComments();
      fetchReviews();
    }
  }, [product]);

  // Gửi bình luận
  const handleSubmitComment = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log("Checking auth:", { hasToken: !!token, hasUser: !!user });

    if (!token || !user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.setItem("redirectAfterLogin", `/productdetail/${id}`);
      displayPopup("Bạn cần đăng nhập để bình luận!", "error");
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) {
      displayPopup("Vui lòng nhập nội dung bình luận!", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_id", product.id);
      formData.append("content", commentContent);
      if (commentImage) formData.append("image", commentImage);

      console.log("Đang gửi bình luận...", {
        product_id: product.id,
        content: commentContent,
        hasImage: !!commentImage,
        tokenPreview: token.substring(0, 20) + "..."
      });

      const res = await axios.post("http://localhost:8000/api/comments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", res.data);

      if (res.data?.success) {
        setCommentContent("");
        setCommentImage(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';

        fetchComments(); // Refresh
        displayPopup("Đã gửi bình luận thành công!", "success");
      } else {
        displayPopup(res.data?.message || "Không thể gửi bình luận!", "error");
      }
    } catch (error) {
      console.error("Lỗi gửi bình luận:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("redirectAfterLogin", `/productdetail/${id}`);
        displayPopup("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.", "error");
        navigate("/login");
      } else if (error.response?.data?.message) {
        displayPopup("Lỗi: " + error.response.data.message, "error");
      } else {
        displayPopup("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại!", "error");
      }
    }
  };

  // Xóa bình luận
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      displayPopup("Bạn cần đăng nhập!", "error");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      const res = await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        fetchComments();
        displayPopup("Đã xóa bình luận!", "success");
      }
    } catch (error) {
      console.error("Lỗi xóa bình luận:", error);
      displayPopup("Xóa bình luận thất bại!", "error");
    }
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className="ProductDetail">

      {/* 👉 Popup/Toast Component - Đặt ở đầu để hiển thị trên cùng */}
      {showPopup && (
        <div
          className={`custom-toast-container bg-${popupType === 'success' ? 'success' : 'danger'} text-white shadow-lg p-3 rounded-3`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex align-items-center">
            <strong className="me-auto">
              <i className={`fas fa-${popupType === 'success' ? 'check-circle' : 'times-circle'} me-2 fs-5`}></i>
              {popupType === 'success' ? 'Thông báo' : 'Lỗi'}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              aria-label="Close"
              onClick={() => setShowPopup(false)}
            ></button>
          </div>
          <div className="mt-2 pt-2 border-top border-light">
            {popupMessage}
          </div>
        </div>
      )}


      <Banner />
      <div className="container py-5">
        <div className="row g-5">
          {/* Gallery Section */}
          <div className="col-md-6">
            <div className="product-gallery">
              <div className="main-image shadow-lg rounded-4 overflow-hidden mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                <img src={mainImg} alt="main product" className="w-100" style={{ height: '500px', objectFit: 'contain' }} />
              </div>

              {/* Thumbnails */}
              <div className="d-flex gap-2 justify-content-center">
                {[
                  product.image,
                  ...product.colors.map(c => c.image).filter(Boolean),
                  ...product.variants.map(v => v.image).filter(Boolean)
                ]
                  .filter((img, index, self) => img && self.indexOf(img) === index) // Loại bỏ trùng lặp
                  .map((img, i) => {
                    const fullImgUrl = img.startsWith('http') ? img : `http://localhost:8000${img}`;
                    return (
                      <img
                        key={i}
                        src={fullImgUrl}
                        alt={product.name}
                        onClick={() => setMainImg(fullImgUrl)}
                        className={`thumbnail-img rounded-3 ${mainImg === fullImgUrl ? 'active' : ''}`}
                        style={{ width: '80px', height: '80px', objectFit: 'contain', cursor: 'pointer', border: mainImg === fullImgUrl ? '3px solid #b88e2f' : '2px solid #ddd', backgroundColor: '#f8f9fa' }}
                      />
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="col-md-6">
            <div className="product-info">
              <h1 className="fw-bold mb-3">{product.name}</h1>

              <div className="d-flex align-items-center gap-3 mb-3">
                <h3 className="text-primary fw-bold mb-0">
                  {formatVND(
                    selectedVariant?.sale_price ||
                    selectedVariant?.price ||
                    product.sale_price ||
                    product.price
                  )}
                </h3>
                {(selectedVariant?.sale_price || product.sale_price) && (
                  <span className="badge bg-danger fs-6">SALE</span>
                )}
              </div>

              <div className="rating mb-3">
                <span className="text-warning fs-5">⭐ ⭐ ⭐ ⭐ ⭐</span>
                <span className="text-muted ms-2">(5 đánh giá)</span>
              </div>

              {/* Stock & Sales Info */}
              <div className="d-flex gap-4 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-box text-success"></i>
                  <span className="fw-semibold">
                    {selectedVariant ? (
                      selectedVariant.quantity > 0 ? (
                        <span className="text-success">Còn {selectedVariant.quantity} sản phẩm</span>
                      ) : (
                        <span className="text-danger">Hết hàng</span>
                      )
                    ) : (
                      <span className="text-muted">Chọn màu và size để xem tồn kho</span>
                    )}
                  </span>
                </div>
                {product.total_sold > 0 && (
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-shopping-bag" style={{ color: '#b88e2f' }}></i>
                    <span className="fw-semibold text-muted">Đã bán: {product.total_sold}</span>
                  </div>
                )}
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Màu sắc</h6>
                <div className="d-flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      style={{
                        backgroundColor: color.hex_code || color.color_code || '#000000',
                        width: '40px',
                        height: '40px',
                        border: selectedColor?.id === color.id ? '3px solid #b88e2f' : '2px solid #ddd',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onClick={() => {
                        setSelectedColor(color);
                        // Ưu tiên ảnh từ bảng product_colors
                        if (color.image) {
                          const colorImgUrl = color.image.startsWith('http') ? color.image : `http://localhost:8000${color.image}`;
                          setMainImg(colorImgUrl);
                        } else {
                          // Nếu không có ảnh màu, tìm variant có màu này
                          const variantWithImage = product.variants.find(v => v.color_id === color.id && v.image);
                          if (variantWithImage && variantWithImage.image) {
                            const variantImgUrl = variantWithImage.image.startsWith('http') ? variantWithImage.image : `http://localhost:8000${variantWithImage.image}`;
                            setMainImg(variantImgUrl);
                          }
                        }
                      }}
                      title={color.name}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Kích thước</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {[...new Set(product.variants.map((v) => v.size))].map((size) => (
                    <button
                      key={size}
                      className={`btn ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'}`}
                      onClick={() => setSelectedSize(size)}
                      style={{ minWidth: '60px', transition: 'all 0.3s' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="d-flex gap-3 align-items-center mb-4">
                <div className="input-group" style={{ maxWidth: '140px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantity("decrease")}
                    disabled={!selectedVariant || selectedVariant.quantity === 0 || quantity === 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={quantity}
                    readOnly
                    style={{ fontWeight: '600' }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantity("increase")}
                    disabled={!selectedVariant || quantity >= (selectedVariant?.quantity || 0)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>

                <button
                  className="btn btn-outline-dark btn-lg flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.quantity === 0}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  {!selectedVariant ? 'Chọn màu & size' : selectedVariant.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                </button>

                <button
                  className="btn btn-dark btn-lg flex-grow-1"
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || selectedVariant.quantity === 0}
                >
                  <i className="fas fa-bolt me-2"></i>
                  {!selectedVariant ? 'Chọn màu & size' : selectedVariant.quantity === 0 ? 'Hết hàng' : 'Mua Ngay'}
                </button>
              </div>

              {/* Product Details */}
              <div className="border-top pt-4">
                <p className="mb-2"><strong>Danh mục:</strong> <span className="text-muted">{product.category?.name || "Không rõ"}</span></p>
                <p className="mb-0"><strong>Tags:</strong> <span className="badge bg-secondary ms-2">{product.tag || "Không có"}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs Section: Description, Comments, Reviews */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light border-0">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                      onClick={() => setActiveTab("description")}
                    >
                      <i className="fas fa-info-circle me-2"></i>Mô tả sản phẩm
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "comments" ? "active" : ""}`}
                      onClick={() => setActiveTab("comments")}
                    >
                      <i className="fas fa-comments me-2"></i>Bình luận
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                      onClick={() => setActiveTab("reviews")}
                    >
                      <i className="fas fa-star me-2"></i>Đánh giá
                    </button>
                  </li>
                </ul>
              </div>

              {/* Description Tab */}
              {activeTab === "description" && (
                <div className="card-body">
                  <h4 className="mb-4 fw-bold">Mô tả sản phẩm</h4>
                  <div className="product-description">
                    <p className="text-secondary lh-lg" style={{ fontSize: '1rem' }}>
                      {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                    </p>

                    {/* Additional Product Info */}
                    <div className="mt-4">
                      <h5 className="fw-semibold mb-3">Thông tin chi tiết</h5>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td className="fw-semibold" style={{ width: '200px' }}>Danh mục</td>
                            <td>{product.category?.name || "Không rõ"}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Màu sắc</td>
                            <td>{product.colors.map(c => c.name).join(', ')}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Kích thước</td>
                            <td>{[...new Set(product.variants.map(v => v.size))].join(', ')}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Tổng số lượng</td>
                            <td>{product.variants.reduce((sum, v) => sum + v.quantity, 0)}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">Đã bán</td>
                            <td>{product.total_sold || 0} sản phẩm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === "comments" && (
                <div className="card-body">
                  <h4 className="mb-4 fw-bold">Bình luận sản phẩm</h4>

                  {/* Comment Form */}
                  <div className="mb-5">
                    <textarea
                      className="form-control mb-3"
                      rows="4"
                      placeholder="Viết bình luận của bạn..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    ></textarea>

                    <div className="d-flex gap-3 align-items-center">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setCommentImage(e.target.files[0])}
                        style={{ maxWidth: '300px' }}
                      />
                      <button
                        className="btn px-4"
                        style={{ backgroundColor: '#b88e2f', color: 'white', border: 'none' }}
                        onClick={handleSubmitComment}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9a7628'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b88e2f'}
                      >
                        <i className="fas fa-paper-plane me-2"></i>Gửi bình luận
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {loadingComments ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Đang tải bình luận...</p>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                    </div>
                  ) : (
                    <div className="comment-list">
                      {comments.map((c) => (
                        <div key={c.id} className="card mb-3 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="fw-bold mb-1">{c.user.name}</h6>
                                <small className="text-muted">{c.created_at}</small>
                              </div>
                              {c.is_owner && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteComment(c.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>

                            <p className="mb-2">{c.content}</p>

                            {c.image && (
                              <img
                                className="rounded-3 mt-2"
                                src={`http://localhost:8000${c.image}`}
                                alt="comment"
                                style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="card-body">
                  <h4 className="mb-4 fw-bold">Đánh giá sản phẩm</h4>

                  {loadingReviews ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Đang tải đánh giá...</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-star fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                    </div>
                  ) : (
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="card mb-3 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="fw-bold mb-1">{review.user?.name || "Người dùng"}</h6>
                                <div className="text-warning mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-muted'}`}></i>
                                  ))}
                                </div>
                                <small className="text-muted">{review.created_at || review.created_at_human}</small>
                              </div>
                            </div>

                            <p className="mb-2">{review.content || "Không có nhận xét"}</p>

                            {review.image && (
                              <div className="mt-3">
                                <img
                                  className="rounded-3"
                                  src={review.image.startsWith('http') ? review.image : `http://localhost:8000${review.image}`}
                                  alt="review"
                                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container my-5">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Sản phẩm liên quan</h3>
            <p className="text-muted">Khám phá thêm các sản phẩm cùng danh mục</p>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {relatedProducts.map((p) => (
              <div className="col" key={p.id}>
                <div className="card h-100 border-0 shadow-sm product-card position-relative" style={{ transition: 'all 0.3s' }}>
                  <a href={`/productdetail/${p.id}`} className="text-decoration-none">
                    <div className="position-relative overflow-hidden">
                      <img
                        src={normalizeImage(p.image)}
                        alt={p.name}
                        className="card-img-top"
                        style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      {p.discount_percent > 0 && (
                        <span className="position-absolute top-0 end-0 m-2 badge bg-danger" style={{ fontSize: '0.85rem' }}>
                          -{p.discount_percent}%
                        </span>
                      )}
                    </div>
                  </a>
                  <div className="card-body d-flex flex-column">
                    <a href={`/productdetail/${p.id}`} className="text-decoration-none">
                      <h5 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '0.95rem', minHeight: '48px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {p.name}
                      </h5>
                    </a>
                    
                    {/* Rating */}
                    <div className="mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                      {(() => {
                        const rating = p.average_rating || 0;
                        const stars = [];
                        const fullStars = Math.floor(rating);
                        const hasHalfStar = rating % 1 >= 0.5;
                        for (let i = 0; i < 5; i++) {
                          if (i < fullStars) {
                            stars.push(<i key={i} className="fas fa-star text-warning"></i>);
                          } else if (i === fullStars && hasHalfStar) {
                            stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
                          } else {
                            stars.push(<i key={i} className="far fa-star text-warning"></i>);
                          }
                        }
                        return stars;
                      })()}
                      <span className="text-muted ms-1">({p.review_count || 0})</span>
                    </div>

                    <div className="mt-auto">
                      {/* Giá */}
                      <div className="mb-2">
                        {p.sale_price ? (
                          <>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="text-danger fw-bold" style={{ fontSize: '1.1rem' }}>
                                {Number(p.sale_price || 0).toLocaleString('vi-VN')}₫
                              </span>
                              <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.9rem' }}>
                                {Number(p.price || 0).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#b88e2f' }}>
                            {Number(p.price || 0).toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>
                      
                      <a 
                        href={`/productdetail/${p.id}`}
                        className="btn w-100 text-white" 
                        style={{ backgroundColor: '#b88e2f', transition: 'all 0.3s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9a7628'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b88e2f'}
                      >
                        <i className="fas fa-eye me-2"></i>Xem chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default ProductDetail;