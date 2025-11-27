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
  console.log(product);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        const data =
          res.data?.data?.product ||
          res.data?.data ||
          res.data.product ||
          res.data;
        console.log("PRODUCT RAW DATA:", data); // <-- thêm dòng này
        setProduct(data);
        if (data.image) {
          setMainImg(`http://localhost:8000${data.image}`);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // chỉnh số lượng
  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const formatVND = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + "₫";

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;

    return product.variants.find(
      (v) => v.size === selectedSize && v.color_id === selectedColor.id
    );
  }, [product, selectedColor, selectedSize]);
  // thêm giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và size trước khi thêm vào giỏ!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
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
        alert("Đã thêm sản phẩm vào giỏ hàng!");
      } else {
        alert(res.data?.message || "Không thể thêm sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        alert("Thêm sản phẩm thất bại!");
      }
    }
  };
  // mua ngay
  const handleBuyNow = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và size trước khi mua!");
      return;
    }

    const item = {
      product_variant_id: selectedVariant.id,
      name: product.name,
      product: product,
      quantity: quantity,
      price: selectedVariant.sale_price || selectedVariant.price || product.price,
      image: selectedVariant.image || product.image,
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
  //Load bình luận sau khi sản phẩm load xong
  useEffect(() => {
    if (product) fetchComments();
  }, [product]);
  // Gửi bình luận
  const handleSubmitComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để bình luận!");
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_id", product.id);
      formData.append("content", commentContent);
      if (commentImage) formData.append("image", commentImage);

      const res = await axios.post("http://localhost:8000/api/comments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        setCommentContent("");
        setCommentImage(null);
        fetchComments(); // Refresh
        alert("Đã gửi bình luận!");
      }
    } catch (error) {
      console.error("Lỗi gửi bình luận:", error);
    }
  };

  // Xóa bình luận
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập!");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      const res = await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        fetchComments();
        alert("Đã xóa bình luận!");
      }
    } catch (error) {
      console.error("Lỗi xóa bình luận:", error);
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
      <Banner />
      <div className="product-detail">
        <div className="product-gallery">
          {/* <div className="thumbnails">
            {[product.image, ...product.variants.map((v) => v.image)]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:8000${img}`}
                  alt={product.name}
                  onClick={() =>
                    setMainImg(`http://localhost:8000${img}`)
                  }
                  className={
                    mainImg === `http://localhost:8000${img}`
                      ? "active"
                      : ""
                  }
                />
              ))}
          </div> */}

          <div className="main-image">
            <img src={mainImg} alt="main product" />
          </div>
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">
            {formatVND(product.sale_price || product.price)}
          </p>
          <div className="rating">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <p>5 Customer Review</p>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="options">
            <div className="color">
              <p>Màu sắc</p>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    style={{ backgroundColor: color.hex_code }}
                    className={selectedColor?.id === color.id ? "active" : ""}
                    onClick={() => {
                      setSelectedColor(color);
                      if (color.image) {
                        setMainImg(`http://localhost:8000${color.image}`);
                      }
                    }}
                  ></button>

                ))}
              </div>
            </div>

            <div className="size">
              <p>Kích thước</p>
              <div className="size-options">
                {[...new Set(product.variants.map((v) => v.size))].map(
                  (size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "active" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="quantity">
              <button onClick={() => handleQuantity("decrease")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantity("increase")}>+</button>
            </div>
            <button className="add-to-cart" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
            <button className="product-buy" onClick={handleBuyNow}>
              Mua Ngay
            </button>
          </div>

          <div className="details">
            <p>
              <strong>SKU:</strong> SP{product.id}
            </p>
            <p>
              <strong>Danh mục:</strong> {product.category?.name || "Không rõ"}
            </p>
            <p>
              <strong>Tags:</strong> {product.tag || ""}
            </p>
          </div>
        </div>
      </div>
      {/* Form viết bình luận */}
      <div className="product-comments">
        <h3>Bình luận sản phẩm</h3>
        <div className="comment-form">
          <textarea
            placeholder="Viết bình luận..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          ></textarea>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCommentImage(e.target.files[0])}
          />
          <button onClick={handleSubmitComment}>Gửi bình luận</button>
        </div>
        {/* Loading của bình luận */}
        {loadingComments ? (
          <p>Đang tải bình luận...</p>
        ) : comments.length === 0 ? (
          <p>Chưa có bình luận nào.</p>
        ) : (
          <div className="comment-list">
            {comments.map((c) => (
              <div key={c.id} className="comment-item">

                <div className="comment-header">
                  <strong>{c.user.name}</strong>
                  <span>{c.created_at}</span>
                </div>

                <p>{c.content}</p>

                {c.image && (
                  <img
                    className="comment-image"
                    src={`http://localhost:8000${c.image}`}
                    alt="comment"
                  />
                )}

                {c.is_owner && (
                  <button
                    className="delete-comment"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>

  );
}
export default ProductDetail;
