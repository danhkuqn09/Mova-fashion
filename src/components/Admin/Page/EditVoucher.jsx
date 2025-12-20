import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/EditVoucher.css"
const EditVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [voucher, setVoucher] = useState({
    code: "",
    discount_percent: "",
    quantity: "",
    min_total: "",
    start_date: "",
    end_date: "",
    max_discount_amount: "",
  });

  // // Lấy chi tiết voucher
  // const fetchVoucher = async () => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8000/api/admin/vouchers/${id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setVoucher(res.data.data);
  //   } catch (err) {
  //     alert("Không thể tải voucher");
  //     navigate(-1);
  //     console.log(err);
      
  //   }
  // };

  // Update voucher
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/vouchers/${id}`,
        voucher,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cập nhật voucher thành công!");
      navigate("/admin/voucher");
    } catch (err) {
      alert("Cập nhật thất bại");
      console.error(err);
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />

        <div className="admin-page">
          <h1 className="mb-4">
            <i className="fas fa-edit text-warning me-2"></i>
            Chỉnh sửa voucher
          </h1>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <input
                className="form-control mb-3"
                placeholder="Mã voucher"
                value={voucher.code}
                onChange={(e) => setVoucher({ ...voucher, code: e.target.value })}
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="% giảm"
                value={voucher.discount_percent}
                onChange={(e) =>
                  setVoucher({ ...voucher, discount_percent: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Số lượng"
                value={voucher.quantity}
                onChange={(e) =>
                  setVoucher({ ...voucher, quantity: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Đơn tối thiểu"
                value={voucher.min_total}
                onChange={(e) =>
                  setVoucher({ ...voucher, min_total: e.target.value })
                }
              />

              <input
                type="date"
                className="form-control mb-3"
                value={voucher.start_date}
                onChange={(e) =>
                  setVoucher({ ...voucher, start_date: e.target.value })
                }
              />

              <input
                type="date"
                className="form-control mb-3"
                value={voucher.end_date}
                onChange={(e) =>
                  setVoucher({ ...voucher, end_date: e.target.value })
                }
              />

              <input
                type="number"
                className="form-control mb-4"
                placeholder="Giảm tối đa"
                value={voucher.max_discount_amount}
                onChange={(e) =>
                  setVoucher({
                    ...voucher,
                    max_discount_amount: e.target.value,
                  })
                }
              />

              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  <i className="fas fa-save me-2"></i>Lưu
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditVoucher;
