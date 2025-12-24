import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "./Banner";
import "./shop.css";
import { Link, useLocation} from "react-router-dom";

function Shop() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const normalizeImage = (img) => {
    if (!img) return "/no-image.png";

    // Nếu đã là URL đầy đủ → trả về luôn
    if (img.startsWith("http")) return img;

    // Nếu image bắt đầu bằng "/storage"
    if (img.startsWith("/storage")) {
      return `http://localhost:8000${img}`;
    }

    // Nếu image bắt đầu bằng "storage/"
    if (img.startsWith("storage/")) {
      return `http://localhost:8000/${img}`;
    }

    // Nếu image KHÔNG có storage → thêm vào
    return `http://localhost:8000/storage/${img}`;
  };

  // Lọc
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tag, setTag] = useState("");
  const [isFiltering, setIsFiltering] = useState(false); // Biến cờ để biết đang lọc

  const location = useLocation();
  // const navigate = useNavigate();

  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  useEffect(() => {
  if (keyword) {
    handleFilterSubmit(); // dùng chung filter
  } else {
    fetchAllData();
  }
}, [keyword]);


  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resCategories, resFeatured, resNewArrivals, resOnSale] =
        await Promise.all([
          axios.get("http://localhost:8000/api/categories"),
          axios.get("http://localhost:8000/api/products/featured"),
          axios.get("http://localhost:8000/api/products/new-arrivals"),
          axios.get("http://localhost:8000/api/products/on-sale"),
        ]);

      setCategories(resCategories.data.data.categories || []);
      console.log(resCategories.data.data.categories);
    
      const getData = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.data)) return res.data.data;
        if (Array.isArray(res.data.data?.products?.data))
          return res.data.data.products.data;
        return [];
      };

      setFeatured(getData(resFeatured));
      setNewArrivals(getData(resNewArrivals));
      setOnSale(getData(resOnSale));

      setProducts([]);
      setSelectedCategory(null);
      setIsFiltering(false); // Reset cờ lọc
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = async (term) => {
  //   setLoading(true);
  //   setSelectedCategory(null);
  //   setIsFiltering(true); // Đang tìm kiếm là đang lọc
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8000/api/products/search?keyword=${encodeURIComponent(
  //         term
  //       )}`
  //     );

  //     const getData = (res) => {
  //       if (Array.isArray(res.data)) return res.data;
  //       if (Array.isArray(res.data.data)) return res.data.data;
  //       if (Array.isArray(res.data.data?.products?.data))
  //         return res.data.data.products.data;
  //       return [];
  //     };

  //     const productsData = getData(res);
  //     setProducts(productsData);
  //   } catch (error) {
  //     console.error("Lỗi khi tìm kiếm sản phẩm:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    setIsFiltering(true); // Chọn danh mục cũng coi là đang xem danh sách lọc
    setLoading(true);

    // Reset các filter giá/tag khi chuyển danh mục (tùy chọn, để trải nghiệm tốt hơn)
    setMinPrice("");
    setMaxPrice("");
    setTag("");

    try {
      const res = await axios.get(
        `http://localhost:8000/api/products/category/${categoryId}`
      );
      const productsData = res.data?.data?.products?.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm theo danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HÀM XỬ LÝ LỌC GIÁ VÀ TAG ---
  const handleFilterSubmit = async () => {
    setLoading(true);
    setIsFiltering(true);

    try {
      const params = new URLSearchParams();

      // Nếu đang chọn danh mục, giữ nguyên việc lọc trong danh mục đó
      if (selectedCategory) {
        params.append("category_id", selectedCategory);
      }
      // Nếu đang có từ khóa tìm kiếm
      if (keyword) {
        params.append("search", keyword);
      }

      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (tag) params.append("tag", tag);

      // Gọi API index của ProductController
      const res = await axios.get(`http://localhost:8000/api/products?${params.toString()}`);

      // Xử lý dữ liệu trả về từ hàm index (có phân trang)
      let productsData = [];
      if (res.data?.data?.products?.data) {
        productsData = res.data.data.products.data; // Trường hợp có paginate
      } else if (res.data?.data?.products) {
        productsData = res.data.data.products; // Trường hợp array thường
      }

      setProducts(productsData);

    } catch (error) {
      console.error("Lỗi khi lọc nâng cao:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render stars
  // const renderStars = (rating) => {
  //   const stars = [];
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 >= 0.5;

  //   for (let i = 0; i < 5; i++) {
  //     if (i < fullStars) {
  //       stars.push(<i key={i} className="fas fa-star text-warning"></i>);
  //     } else if (i === fullStars && hasHalfStar) {
  //       stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
  //     } else {
  //       stars.push(<i key={i} className="far fa-star text-warning"></i>);
  //     }
  //   }
  //   return stars;
  // };

  // Render functions
  const renderProducts = (list) =>
    list.map((p) => (
      <div className="col" key={p.id}>
        <div className="card h-100 border-0 shadow-sm product-card position-relative" style={{ transition: 'all 0.3s' }}>
          <Link to={`/productdetail/${p.id}`} className="text-decoration-none">
            <div className="position-relative overflow-hidden">
              <img
                src={normalizeImage(p.image)}
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
            </div>
          </Link>
          <div className="card-body d-flex flex-column">
            <Link to={`/productdetail/${p.id}`} className="text-decoration-none">
              <h5 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '0.95rem', minHeight: '48px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {p.name}
              </h5>
            </Link>

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
              <span className="text-muted ms-1">
                ({p.review_count || 0})
              </span>
            </div>

            <div className="mt-auto">
              {/* Giá */}
              <div className="mb-3">
                {p.sale_price ? (
                  <>
                    <div className="d-flex align-items-baseline gap-2 mb-1">
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

              {/* Button Xem chi tiết */}
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
    ));

  const renderCategories = () =>
    categories.map((c) => (
      <button
        key={c.id}
        onClick={() => handleCategoryClick(c.id)}
        className={`btn btn-sm ${selectedCategory === c.id ? 'btn-primary' : 'btn-outline-primary'}`}
        style={{ borderRadius: '20px', padding: '8px 20px', transition: 'all 0.3s' }}
      >
        {c.name}
      </button>
    ));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="shop">
      <Banner />

      <section className="categories py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 fw-bold">Danh mục sản phẩm</h2>
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            {renderCategories()}
          </div>

          <div className="filter-box card shadow-sm p-4 mx-auto" style={{ maxWidth: '900px' }}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label fw-semibold">Giá từ</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Đến</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Tag</label>
                <select className="form-select" value={tag} onChange={(e) => setTag(e.target.value)}>
                  <option value="">Chọn Tag</option>
                  <option value="hot">🔥 Nổi bật</option>
                  <option value="new">✨ Mới</option>
                  <option value="sale">💰 Giảm giá</option>
                </select>
              </div>

              <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-primary flex-grow-1" onClick={handleFilterSubmit}>
                  <i className="fas fa-filter me-2"></i>Lọc
                </button>

                {(minPrice || maxPrice || tag) && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setTag("");
                      selectedCategory
                        ? handleCategoryClick(selectedCategory)
                        : fetchAllData();
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {keyword || selectedCategory || isFiltering ? (
        <section className="products py-5">
          <div className="container">
            <h2 className="text-center mb-4 fw-bold">
              {keyword
                ? `🔍 Kết quả tìm kiếm cho "${keyword}"`
                : "📦 Danh sách sản phẩm"}
            </h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
              {products.length > 0 ? (
                renderProducts(products)
              ) : (
                <div className="col-12 text-center py-5">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <p className="text-muted fs-5">Không tìm thấy sản phẩm phù hợp.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="products py-5 bg-white">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold">⭐ Sản phẩm nổi bật</h2>
                <p className="text-muted">Những sản phẩm được xem nhiều nhất</p>
              </div>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                {renderProducts(featured)}
              </div>
            </div>
          </section>

          <section className="products py-5 bg-light">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold">✨ Hàng mới về</h2>
                <p className="text-muted">Cập nhật xu hướng thời trang mới nhất</p>
              </div>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                {renderProducts(newArrivals)}
              </div>
            </div>
          </section>

          <section className="products py-5 bg-white">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="fw-bold">🔥 Đang giảm giá</h2>
                <p className="text-muted">Ưu đãi hấp dẫn - Không thể bỏ lỡ</p>
              </div>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                {renderProducts(onSale)}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Shop;