import React, { useState, useEffect } from "react";
import "./Product.css";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  // const navigate = useNavigate();

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

  // const handleBuyNow = (p) => {
  //   const firstVariant = p.variants?.[0]; // lấy variant đầu tiên
  //   if (!firstVariant) {
  //     alert("Sản phẩm này chưa có biến thể!");
  //     return;
  //   }

  //   const price = firstVariant.price_after_discount ?? firstVariant.price;
  //   navigate("/checkout", {
  //     state: {
  //       buyNow: true,
  //       item: {
  //         product_variant_id: firstVariant.id,
  //         quantity: 1,
  //         price: price,
  //         name: p.name,
  //       },
  //       subtotal: price,
  //     },
  //   });
  // };

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
              <div className="card h-100 border-0 shadow-sm product-card">
                <Link to={`/productdetail/${p.id}`} className="text-decoration-none">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={`http://localhost:8000${p.image}`}
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.3s' }}
                    />
                    {p.price_after_discount && (
                      <span className="position-absolute top-0 end-0 badge bg-danger m-2">SALE</span>
                    )}
                  </div>
                </Link>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '0.95rem', minHeight: '48px' }}>{p.name}</h5>
                  <div className="mt-auto">
                    {p.price_after_discount ? (
                      <div className="mb-2">
                        <span className="text-danger fw-bold fs-6 me-2">
                          {Number(p.price_after_discount).toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.85rem' }}>
                          {Number(p.price).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    ) : (
                      <p className="text-primary fw-bold fs-6 mb-2">{Number(p.price).toLocaleString('vi-VN')}₫</p>
                    )}
                    <Link
                      to={`/productdetail/${p.id}`}
                      className="btn btn-dark w-100 btn-sm"
                    >
                      <i className="fas fa-eye me-2"></i>Xem Chi Tiết
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
