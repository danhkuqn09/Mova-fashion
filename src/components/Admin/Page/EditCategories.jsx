import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/EditCategories.css";
import { useParams, useNavigate } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Lấy dữ liệu category theo ID
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cat = res.data.data;

        setName(cat.name);
        setDescription(cat.description || "");
        setOldImage(cat.image);
      } catch (error) {
        console.error("Lỗi khi lấy category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, token]);

  // Xử lý update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    if (previewImage) {
      formData.append("image", previewImage);
    }

    try {
      await axios.post(
        `http://localhost:8000/api/admin/categories/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Cập nhật danh mục thành công!");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Lỗi khi update:", error);
      alert(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <Topbar />

        <div className="admin-page">
          <h1>Sửa Danh Mục</h1>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <form className="category-form" onSubmit={handleUpdate}>

              <label>Tên danh mục</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Ảnh */}
              <label>Ảnh danh mục</label>
              <div className="category-image-box">
                {oldImage && !previewImage && (
                  <img
                    src={`http://localhost:8000${oldImage}`}
                    alt="old"
                    className="category-img-preview"
                  />
                )}

                {previewImage && (
                  <img
                    src={URL.createObjectURL(previewImage)}
                    alt="new"
                    className="category-img-preview"
                  />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPreviewImage(e.target.files[0])}
              />

              <div className="form-actions">
                <button type="submit" className="btn-editCategories">Cập nhật</button>
                <button
                  type="button"
                  className="btn-cancelCategories"
                  onClick={() => navigate("/admin/categories")}
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
