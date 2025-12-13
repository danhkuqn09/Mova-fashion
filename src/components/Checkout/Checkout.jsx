import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import Banner from "./BannerCheckout";

const formatCurrency = (amount) =>
  amount.toLocaleString("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 });

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
 const { buyNow = false, item = null, cartItems = [], subtotal = 0 } = location.state || {};

  // Debug
  console.log("Checkout data:", { buyNow, item, cartItems });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment_method: "",
  });
  const [loading, setLoading] = useState(false);

  // Load available vouchers
  useEffect(() => {
    const fetchAvailableVouchers = async () => {
      const token = localStorage.getItem("token");
      if (!token || !subtotal) return;

      try {
        const res = await axios.get("http://localhost:8000/api/vouchers/available", {
          params: { order_total: subtotal },
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setAvailableVouchers(res.data.data.available || []);
          setUpcomingVouchers(res.data.data.upcoming || []);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchAvailableVouchers();
  }, [subtotal]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.email || !form.payment_method) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      alert("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      let payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        payment_method: form.payment_method,
        voucher_code: voucher || null,
      };

      if (buyNow && item) {
        // BUY NOW
        payload.product_variant_id = item.product_variant_id;
        payload.quantity = item.quantity;
      } else {
        // CHECKOUT GIỎ HÀNG
        payload.cart_item_ids = cartItems.map((i) => i.id);
      }

      // mua ngay
      const url = buyNow
        ? "http://localhost:8000/api/orders/buy-now"
        : "http://localhost:8000/api/orders";

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (res.data.success) {
        if (res.data.data.payment_method === "momo" && res.data.data.payment_url) {
          // Chuyển sang MOMO
          window.location.href = res.data.data.payment_url;
        } else if (res.data.data.payment_method === "payos" && res.data.data.payment_url) {
          // Chuyển sang PayOS nếu cần
          window.location.href = res.data.data.payment_url;
        } else {
          alert("Đặt hàng thành công!");
          navigate("/order");
        }
      } else {
        alert("Đặt hàng thất bại!");
      }
    } catch (error) {
      console.error(error.response?.data);
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join("\n");
        alert("Lỗi xác thực:\n" + messages);
      } else {
        alert("Lỗi server khi đặt hàng!");
      }
    } finally {
      setLoading(false);
    }
  };
  const [voucher, setVoucher] = useState("");
  const [voucherInfo, setVoucherInfo] = useState(null); // lưu thông tin giảm giá
  const [discountAmount, setDiscountAmount] = useState(0); // lưu số tiền giảm giá
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [upcomingVouchers, setUpcomingVouchers] = useState([]);
  const [showVoucherList, setShowVoucherList] = useState(false);
  const handleApplyVoucher = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      alert("Bạn cần đăng nhập để sử dụng voucher!");
      navigate("/login");
      return;
    }
    if (!voucher) {
      alert("Vui lòng nhập mã voucher!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/vouchers/check", {
        code: voucher,
        order_total: subtotal,  // tổng đơn hàng
      },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const data = res.data.data;

        setVoucherInfo(data);
        setDiscountAmount(data.discount_amount);

        alert("Áp dụng voucher thành công!");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Không thể áp dụng voucher!");
      }

      setVoucherInfo(null);
      setDiscountAmount(0);
    }
    console.log("Subtotal gửi lên check voucher:", subtotal);

  };

  return (
    <div className="main-content-wrapper2">
      <Banner />
      <div className="container py-5">
        <div className="row g-4">
          {/* Form thông tin người nhận */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-header text-white py-3" style={{ backgroundColor: '#b88e2f' }}>
                <h4 className="mb-0">
                  <i className="fas fa-user-edit me-2"></i>
                  Thông tin người nhận
                </h4>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="fas fa-user me-2 text-muted"></i>
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text"
                        name="name" 
                        className="form-control" 
                        value={form.name} 
                        onChange={handleChange} 
                        placeholder="Nhập họ tên..." 
                        disabled={loading}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="fas fa-phone me-2 text-muted"></i>
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="tel"
                        name="phone" 
                        className="form-control" 
                        value={form.phone} 
                        onChange={handleChange} 
                        placeholder="Nhập số điện thoại..." 
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="fas fa-envelope me-2 text-muted"></i>
                        Email <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="email"
                        name="email" 
                        className="form-control" 
                        value={form.email} 
                        onChange={handleChange} 
                        placeholder="Nhập email..." 
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                        Địa chỉ giao hàng <span className="text-danger">*</span>
                      </label>
                      <textarea 
                        name="address" 
                        className="form-control" 
                        rows="3"
                        value={form.address} 
                        onChange={handleChange} 
                        placeholder="Nhập địa chỉ đầy đủ..." 
                        disabled={loading}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="fas fa-credit-card me-2 text-muted"></i>
                        Phương thức thanh toán <span className="text-danger">*</span>
                      </label>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div 
                            className={`payment-card ${form.payment_method === "momo" ? "selected" : ""}`}
                            onClick={() => !loading && setForm({...form, payment_method: "momo"})}
                          >
                            <input
                              type="radio"
                              name="payment_method"
                              value="momo"
                              checked={form.payment_method === "momo"}
                              onChange={handleChange}
                              disabled={loading}
                              className="d-none"
                            />
                            <img src="/Image/MOMO.png" alt="MoMo" className="payment-logo" />
                            <div className="payment-text">
                              <strong>MoMo</strong>
                              <small className="d-block text-muted">Ví điện tử MoMo</small>
                            </div>
                            {form.payment_method === "momo" && (
                              <i className="fas fa-check-circle text-success"></i>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div 
                            className={`payment-card ${form.payment_method === "COD" ? "selected" : ""}`}
                            onClick={() => !loading && setForm({...form, payment_method: "COD"})}
                          >
                            <input
                              type="radio"
                              name="payment_method"
                              value="COD"
                              checked={form.payment_method === "COD"}
                              onChange={handleChange}
                              disabled={loading}
                              className="d-none"
                            />
                            <img src="/Image/COD1.jpg" alt="COD" className="payment-logo" />
                            <div className="payment-text">
                              <strong>COD</strong>
                              <small className="d-block text-muted">Thanh toán khi nhận hàng</small>
                            </div>
                            {form.payment_method === "COD" && (
                              <i className="fas fa-check-circle text-success"></i>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="fas fa-ticket-alt me-2 text-muted"></i>
                        Mã giảm giá
                      </label>
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Nhập mã giảm giá..." 
                          value={voucher} 
                          onChange={(e) => setVoucher(e.target.value)}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="btn text-white"
                          style={{ backgroundColor: '#b88e2f' }}
                          onClick={handleApplyVoucher}
                          disabled={loading}
                        >
                          <i className="fas fa-check me-2"></i>Áp dụng
                        </button>
                      </div>
                      {voucherInfo && (
                        <div className="alert alert-success mt-2 mb-0">
                          <i className="fas fa-check-circle me-2"></i>
                          Áp dụng voucher <strong>{voucherInfo.voucher.code}</strong> thành công! 
                          Giảm <strong>{formatCurrency(discountAmount)}</strong>
                        </div>
                      )}
                      
                      {/* Nút xem voucher có sẵn */}
                      {(availableVouchers.length > 0 || upcomingVouchers.length > 0) && (
                        <button
                          type="button"
                          className="btn btn-link text-decoration-none p-0 mt-2"
                          onClick={() => setShowVoucherList(!showVoucherList)}
                          style={{ color: '#b88e2f' }}
                        >
                          <i className={`fas fa-chevron-${showVoucherList ? 'up' : 'down'} me-2`}></i>
                          {showVoucherList ? 'Ẩn mã giảm giá' : `Xem ${availableVouchers.length} mã giảm giá có thể dùng`}
                        </button>
                      )}

                      {/* Danh sách voucher */}
                      {showVoucherList && (
                        <div className="mt-3">
                          {availableVouchers.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-success fw-bold mb-2">
                                <i className="fas fa-gift me-2"></i>Có thể áp dụng ngay
                              </h6>
                              {availableVouchers.map((v) => (
                                <div 
                                  key={v.id} 
                                  className="voucher-item border rounded p-3 mb-2 d-flex justify-content-between align-items-center"
                                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#b88e2f'}
                                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#dee2e6'}
                                  onClick={() => {
                                    setVoucher(v.code);
                                    setShowVoucherList(false);
                                  }}
                                >
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-1">
                                      <span className="badge text-white me-2" style={{ backgroundColor: '#b88e2f' }}>
                                        {v.code}
                                      </span>
                                      <strong className="text-success">-{v.discount_percent}%</strong>
                                    </div>
                                    <small className="text-muted">
                                      Giảm tối đa: {formatCurrency(v.max_discount_amount || 0)}
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                      Đơn tối thiểu: {formatCurrency(v.min_total)}
                                    </small>
                                    <br />
                                    <small className="text-info">
                                      Tiết kiệm: {formatCurrency(v.discount_amount)}
                                    </small>
                                  </div>
                                  <button 
                                    type="button"
                                    className="btn btn-sm text-white"
                                    style={{ backgroundColor: '#b88e2f' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVoucher(v.code);
                                      setShowVoucherList(false);
                                    }}
                                  >
                                    Chọn
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {upcomingVouchers.length > 0 && (
                            <div>
                              <h6 className="text-warning fw-bold mb-2">
                                <i className="fas fa-lock me-2"></i>Mua thêm để mở khóa
                              </h6>
                              {upcomingVouchers.map((v) => (
                                <div 
                                  key={v.id} 
                                  className="voucher-item border rounded p-3 mb-2 opacity-75"
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className="d-flex align-items-center mb-1">
                                        <span className="badge bg-secondary me-2">{v.code}</span>
                                        <strong className="text-muted">-{v.discount_percent}%</strong>
                                      </div>
                                      <small className="text-muted">
                                        Giảm tối đa: {formatCurrency(v.max_discount_amount || 0)}
                                      </small>
                                      <br />
                                      <small className="text-warning">
                                        Cần mua thêm: {formatCurrency(v.min_total - subtotal)}
                                      </small>
                                    </div>
                                    <i className="fas fa-lock text-muted"></i>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="col-12 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-lg w-100 text-white"
                        style={{ backgroundColor: '#b88e2f' }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-shopping-bag me-2"></i>
                            ĐẶT HÀNG NGAY
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-header text-white py-3" style={{ backgroundColor: '#b88e2f' }}>
                <h4 className="mb-0">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Đơn hàng của bạn
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="order-items mb-3">
                  {buyNow && item ? (
                    <div className="order-item-card mb-3 p-3 bg-light rounded">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image ? `http://localhost:8000${item.image}` : '/Image/default.png'} 
                            alt={item.name}
                            className="rounded"
                            style={{ width: '60px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">
                            {item.color && <span className="me-2"><i className="fas fa-circle" style={{ fontSize: '8px' }}></i> {item.color}</span>}
                            {item.size && <span><i className="fas fa-ruler" style={{ fontSize: '8px' }}></i> {item.size}</span>}
                          </small>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <span className="text-muted">SL: {item.quantity}</span>
                            <strong style={{ color: '#b88e2f' }}>{formatCurrency(item.price * item.quantity)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    cartItems.map((item) => {
                      // Debug để xem cấu trúc data
                      console.log("Cart item in checkout:", item);
                      
                      return (
                        <div key={item.id} className="order-item-card mb-3 p-3 bg-light rounded">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <img 
                                src={item.product?.image ? `http://localhost:8000/storage/${item.product.image}` : '/Image/default.png'} 
                                alt={item.product?.name || item.name}
                                className="rounded"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              />
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">{item.product?.name || item.name}</h6>
                              <small className="text-muted d-block">
                                {item.variant?.color && (
                                  <span className="me-2">
                                    <i className="fas fa-circle" style={{ fontSize: '8px', color: item.variant.color_hex || '#b88e2f' }}></i> Màu: {item.variant.color}
                                  </span>
                                )}
                                {item.variant?.size && (
                                  <span>
                                    <i className="fas fa-ruler" style={{ fontSize: '8px', color: '#b88e2f' }}></i> Size: {item.variant.size}
                                  </span>
                                )}
                                {/* Fallback nếu không có variant */}
                                {!item.variant?.color && !item.variant?.size && (
                                  <span className="text-danger">Chưa có thông tin màu/size</span>
                                )}
                              </small>
                              <div className="d-flex justify-content-between align-items-center mt-2">
                                <span className="text-muted">SL: {item.quantity}</span>
                                <strong style={{ color: '#b88e2f' }}>{formatCurrency(item.price * item.quantity)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <hr />

                <div className="order-summary">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tạm tính:</span>
                    <span className="fw-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {voucherInfo && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>
                        <i className="fas fa-tag me-2"></i>
                        Giảm giá ({voucherInfo.voucher.code}):
                      </span>
                      <span className="fw-bold">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Phí vận chuyển:</span>
                    <span className="text-success fw-bold">Miễn phí</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Tổng cộng:</h5>
                    <h4 className="mb-0 fw-bold" style={{ color: '#b88e2f' }}>
                      {formatCurrency(subtotal - discountAmount)}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;