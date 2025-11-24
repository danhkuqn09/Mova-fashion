import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


export default function MomoCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const resultCode = query.get("resultCode");
    const extraData = query.get("extraData");

    if (!extraData) {
      navigate("/order");
      return;
    }

    const orderInfo = JSON.parse(atob(extraData));
    const orderId = orderInfo.order_id;

    if (resultCode == 0) {
      alert("Thanh toán MOMO thành công!");
      navigate("/order");
    } else {
      alert("Thanh toán thất bại!");
      navigate("/order");
    }
  }, [location, navigate]);

  return (
    <p>Đang xử lý thanh toán MOMO...</p>
  );
}
