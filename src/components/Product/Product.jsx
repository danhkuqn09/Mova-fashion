import React, { useState, useEffect } from "react";
import "./Product.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/products");

        const productData = Array.isArray(res.data.data?.products)
          ? res.data.data.products
          : [];

        setProducts(productData);
        console.log(productData)
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  const showMore = () => setVisibleCount((prev) => prev + 10);

  // Render stars
  const renderStars = (rating) => {
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
  };

  return (
    <section className="products py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Sản phẩm của chúng tôi</h2>
          <p className="text-muted">Khám phá bộ sưu tập thời trang cao cấp</p>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {products.slice(0, visibleCount).map((p) => (
            <div className="col" key={p.id}>
              <div className="card h-100 border-0 shadow-sm product-card position-relative" style={{ transition: 'all 0.3s' }}>
                <Link to={`/productdetail/${p.id}`} className="text-decoration-none">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={`http://localhost:8000${p.image}`}
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {/* Badge SALE */}
                    {p.discount_percent > 0 && (
                      <span className="position-absolute top-0 end-0 badge bg-danger m-2 px-3 py-2" style={{ fontSize: '0.85rem' }}>
                        -{p.discount_percent}%
                      </span>
                    )}
                    {/* Badge tag */}
                    {p.tag && (
                      <span className="position-absolute top-0 start-0 badge m-2 px-3 py-2" 
                        style={{ 
                          fontSize: '0.75rem',
                          backgroundColor: p.tag === 'new' ? '#28a745' : p.tag === 'hot' ? '#dc3545' : '#ffc107'
                        }}>
                        {p.tag.toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>
                
                <div className="card-body d-flex flex-column">
                  <Link to={`/productdetail/${p.id}`} className="text-decoration-none">
                    <h5 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '0.95rem', minHeight: '48px' }}>
                      {p.name}
                    </h5>
                  </Link>

                  {/* Rating */}
                  <div className="mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                    {renderStars(p.average_rating || 0)}
                    <span className="text-muted ms-1">
                      ({p.review_count || 0})
                    </span>
                  </div>

                  <div className="mt-auto">
                    {/* Giá */}
                    <div className="mb-2">
                      {p.sale_price ? (
                        <>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="text-danger fw-bold fs-5">
                              {Number(p.sale_price).toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                          <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.85rem' }}>
                            {Number(p.price).toLocaleString('vi-VN')}₫
                          </span>
                        </>
                      ) : (
                        <span className="text-primary fw-bold fs-5">
                          {Number(p.price).toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <Link 
                      to={`/productdetail/${p.id}`}
                      className="btn w-100 btn-sm d-flex align-items-center justify-content-center gap-2 btn-brand"
                      style={{ 
                        fontSize: '0.9rem', 
                        transition: 'all 0.3s', 
                        padding: '0.5rem',
                        backgroundColor: '#b88e2f',
                        color: 'white',
                        border: 'none'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9a7628'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b88e2f'}
                    >
                      <i className="fas fa-eye"></i>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < products.length && (
          <div className="text-center mt-5">
            <button 
              className="btn btn-lg px-5" 
              onClick={showMore}
              style={{ 
                backgroundColor: '#b88e2f', 
                color: 'white', 
                border: 'none',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9a7628'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b88e2f'}
            >
              Hiển thị thêm <i className="fas fa-chevron-down ms-2"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductSection;
