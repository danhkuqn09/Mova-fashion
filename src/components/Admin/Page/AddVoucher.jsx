import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/AddVoucher.css";
import { useNavigate } from "react-router-dom";

const AddVoucher = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        code: "",
        discount_percent: "",
        quantity: "",
        min_total: "",
        start_date: "",
        end_date: "",
        max_discount_amount: "",
    });

    const handleCreate = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/admin/vouchers",
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Thêm voucher thành công!");
            navigate("/admin/voucher"); // 🔙 Quay về trang danh sách
        } catch (err) {
            console.error("Create voucher error:", err);
            if (err.response?.data?.errors) {
                const msg = Object.values(err.response.data.errors)[0][0];
                alert(msg);
            } else {
                alert("Không thể tạo voucher");
            }
        }
    };

    return (
        <div className="voucher-form-page">

            <div className="form-group">
                <label>Mã Voucher</label>
                <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
            </div>

            <div className="form-group">
                <label>% Giảm</label>
                <input
                    type="number"
                    value={form.discount_percent}
                    onChange={(e) =>
                        setForm({ ...form, discount_percent: e.target.value })
                    }
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Số lượng</label>
                    <input
                        type="number"
                        value={form.quantity}
                        onChange={(e) =>
                            setForm({ ...form, quantity: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Đơn tối thiểu</label>
                    <input
                        type="number"
                        value={form.min_total}
                        onChange={(e) =>
                            setForm({ ...form, min_total: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) =>
                            setForm({ ...form, start_date: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Ngày kết thúc</label>
                    <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) =>
                            setForm({ ...form, end_date: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Giảm tối đa</label>
                <input
                    type="number"
                    value={form.max_discount_amount}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            max_discount_amount: e.target.value,
                        })
                    }
                />
            </div>

            <div className="form-buttons">
                <button onClick={handleCreate}>Tạo voucher</button>
                <button onClick={() => navigate(-1)}>Hủy</button>
            </div>
        </div>

    );
};

export default AddVoucher;
