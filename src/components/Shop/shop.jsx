import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "./Banner";
import "./shop.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  useEffect(() => {
    if (keyword) {
      handleSearch(keyword);
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

  const handleSearch = async (term) => {
    setLoading(true);
    setSelectedCategory(null);
    setIsFiltering(true);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/products?search=${encodeURIComponent(term)}`
      );

      let productsData = [];

      if (res.data?.data?.products?.data) {
        productsData = res.data.data.products.data; // paginate
      } else if (res.data?.data?.products) {
        productsData = res.data.data.products; // array
      } else if (Array.isArray(res.data?.data)) {
        productsData = res.data.data; // fallback
      }

      setProducts(productsData);

    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };


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
  // ------------------------------------

  const handleBuyNow = (p) => {
    const firstVariant = p.variants?.[0]; // lấy variant đầu tiên

    if (!firstVariant) {
      alert("Sản phẩm này chưa có biến thể!");
      return;
    }

    const price = firstVariant.price_after_discount ?? firstVariant.price;

    navigate("/checkout", {
      state: {
        buyNow: true,
        item: {
          product_variant_id: firstVariant.id,  // ✅ ĐÚNG
          quantity: 1,
          price: price,
          name: p.name,
        },
        subtotal: price,
      },
    });
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const renderProducts = (list) =>
    list.map((p) => (
      <div className="product-card" key={p.id}>
        <Link to={`/productdetail/${p.id}`}>
          <img src={normalizeImage(p.image)} alt={p.name} />
        </Link>
        <div className="product-info">
          <h3>{p.name}</h3>
          <p>{p.price}₫</p>
          <div className="buy-btn" onClick={() => handleBuyNow(p)}>Mua Ngay</div>
        </div>
      </div>

    ));

  const renderCategories = () =>
    categories.map((c) => (
      <button
        key={c.id}
        onClick={() => handleCategoryClick(c.id)}
        className={`category-btn ${selectedCategory === c.id ? "active" : ""}`}
      >
        {c.name}
      </button>
    ));

  return (
    <div className="shop">
      <Banner />

      <section className="categories">
        <h2>Danh mục sản phẩm</h2>
        <div className="category-list">{renderCategories()}</div>

        <div className="filter-box">
          <div className="filter-group">
            <label>Giá từ</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Đến</label>
            <input
              type="number"
              placeholder="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Tag</label>
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option> Chọn Tag</option>
              <option value="hot">Hot</option>
              <option value="new">New</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          <button className="filter-btn" onClick={handleFilterSubmit}>
            Lọc
          </button>

          {(minPrice || maxPrice || tag) && (
            <button
              className="clear-btn"
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                setTag("");
                selectedCategory
                  ? handleCategoryClick(selectedCategory)
                  : fetchAllData();
              }}
            >
              Xóa
            </button>
          )}
        </div>

      </section>

      {/*  hiển thị: Nếu có keyword HOẶC đang chọn danh mục HOẶC đang lọc giá/tag (biến isFiltering) */}
      {keyword || selectedCategory || isFiltering ? (
        <section className="products">
          <h2>
            {keyword
              ? `Kết quả tìm kiếm cho "${keyword}"`
              : "Danh sách sản phẩm"}
          </h2>
          <div className="shop-grid">
            {products.length > 0 ? (
              renderProducts(products)
            ) : (
              <p>Không tìm thấy sản phẩm phù hợp.</p>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="products">
            <h2>Sản phẩm nổi bật</h2>
            <div className="product-grid">{renderProducts(featured)}</div>
          </section>

          <section className="products">
            <h2>Hàng mới về</h2>
            <div className="product-grid">{renderProducts(newArrivals)}</div>
          </section>

          <section className="products">
            <h2>Đang giảm giá</h2>
            <div className="product-grid">{renderProducts(onSale)}</div>
          </section>
        </>
      )}
    </div>
  );
}

export default Shop;