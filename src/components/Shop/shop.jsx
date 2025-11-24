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
  const location = useLocation();
  const navigate = useNavigate();
  // 🧠 Lấy từ khóa từ URL (ví dụ: /shop?query=áo)
  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  // 🔁 Khi thay đổi query → gọi API tìm kiếm
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

      // Giữ nguyên các phần khác
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
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };


  // 🔍 Hàm gọi API tìm kiếm
  const handleSearch = async (term) => {
    setLoading(true);
    setSelectedCategory(null);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/products/search?keyword=${encodeURIComponent(term)}`
      );


      const getData = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.data)) return res.data.data;
        if (Array.isArray(res.data.data?.products?.data))
          return res.data.data.products.data;
        return [];
      };

      setProducts(getData(res));
      const productsData = res.data?.data?.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lọc sản phẩm danh mục
  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
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

  const handleBuyNow = (p) => {
    const price = p.price_after_discount ?? p.price;

    navigate("/checkout", {
      state: {
        buyNow: true,
        item: {
          product_variant_id: p.id,  // hoặc p.variant_id nếu có biến thể
          quantity: 1,
          price: price,
          name: p.name,
        },
        subtotal: price,
      },
    });
  };
  // 🌀 Loading spinner
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
          <img
            src={`http://localhost:8000/storage/${p.image}`}
            alt={p.name}
          />
        </Link>
        <h3>{p.name}</h3>
        <p>{p.price}₫</p>
        <button className="buy-btn" onClick={() => handleBuyNow(p)}>
          Mua Ngay
        </button>
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
      </section>

      {/* Nếu đang tìm kiếm hoặc lọc danh mục */}
      {keyword || selectedCategory ? (
        <section className="products">
          <h2>
            {keyword
              ? `Kết quả tìm kiếm cho "${keyword}"`
              : "Sản phẩm theo danh mục"}
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
