import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function MomoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const query = new URLSearchParams(location.search);
        
        // Lấy tất cả params từ MoMo
        const resultCode = query.get("resultCode");
        const orderId = query.get("orderId");
        const extraData = query.get("extraData");
        const transId = query.get("transId");
        const message = query.get("message");

        if (!extraData) {
          alert("Không tìm thấy thông tin đơn hàng");
          navigate("/order");
          return;
        }

        // Gọi backend API để cập nhật trạng thái
        const response = await axios.get(`http://localhost:8000/api/momo/callback`, {
          params: {
            resultCode,
            orderId,
            extraData,
            transId,
            message,
          },
        });

        if (response.data.success) {
          alert("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
          navigate("/order");
        } else {
          alert(response.data.message || "Thanh toán thất bại!");
          navigate("/order");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        alert("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng kiểm tra lại đơn hàng.");
        navigate("/order");
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [location, navigate]);

  return (
    <div className="container text-center py-5">
      {processing ? (
        <>
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3>Đang xử lý thanh toán...</h3>
          <p className="text-muted">Vui lòng không tắt trang này</p>
        </>
      ) : (
        <p>Đang chuyển hướng...</p>
      )}
    </div>
  );
}
