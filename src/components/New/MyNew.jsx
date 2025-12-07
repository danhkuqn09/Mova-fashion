import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyNew.css";

const MyNews = () => {
  const [loading, setLoading] = useState(true);
  const [myNews, setMyNews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: null,
    title: "",
    summary: "",
    content: "",
    thumbnail: null,
  });

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  // Fetch danh sách bài viết
  const fetchMyNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/news/my-news",
        axiosConfig
      );
      setMyNews(res.data.data.news);
      console.log(res.data.data.news);
      
    } catch (err) {
      console.error(err);
      setMyNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNews();
  }, []);

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setForm({
      id: null,
      title: "",
      summary: "",
      content: "",
      thumbnail: null,
    });
  };

  // Tạo bài viết
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("summary", form.summary);
    formData.append("content", form.content);
    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);

    try {
      await axios.post(
        "http://localhost:8000/api/news",
        formData,
        axiosConfig
      );
      alert("Tạo bài viết thành công!");
      resetForm();
      setIsFormOpen(false);
      fetchMyNews();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo bài viết");
    }
  };

  // Cập nhật bài viết
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("summary", form.summary);
    formData.append("content", form.content);
    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);

    try {
      await axios.post(
        `http://localhost:8000/api/news/${form.id}`,
        formData,
        axiosConfig
      );
      alert("Cập nhật bài viết thành công!");
      resetForm();
      setIsFormOpen(false);
      fetchMyNews();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật bài viết");
    }
  };

  // Bắt đầu sửa bài viết
  const startEdit = (item) => {
    if (item.status !== "draft" && item.status !== "rejected") {
      alert("Bạn chỉ có thể sửa bài viết đang ở trạng thái Nháp hoặc Bị từ chối!");
      return;
    }

    setIsEditing(true);
    setForm({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      thumbnail: null,
    });

    setIsFormOpen(true);
  };

  // Gửi bài viết để duyệt
  const handleSubmitReview = async (id) => {
    if (!id) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/news/${id}/submit`,
        {},
        axiosConfig
      );
      alert("Gửi bài viết duyệt thành công!");
      fetchMyNews();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi duyệt bài viết!");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="my-news-container">

      {/* Nút mở form */}
      <button
        className="create-btn"
        onClick={() => {
          setIsFormOpen(!isFormOpen);
          resetForm();
        }}
      >
        {isFormOpen ? "Đóng form" : "Tạo bài viết"}
      </button>

      {/* Form tạo / sửa bài viết */}
      {isFormOpen && (
        <form
          className="my-news-form"
          onSubmit={isEditing ? handleUpdate : handleCreate}
        >
          <input
            type="text"
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Tóm tắt"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            required
          />

          <textarea
            placeholder="Nội dung"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />

          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, thumbnail: e.target.files[0] })
            }
          />

          <button type="submit">
            {isEditing ? "Cập nhật bài viết" : "Tạo bài viết"}
          </button>
        </form>
      )}

      {/* Danh sách bài viết */}
      <div className="my-news-list">
        <h2>Bài viết của tôi</h2>

        {myNews.map((item) => (
          <div key={item.id} className="mynew-item">
            {item.thumbnail && (
              <img
                src={`http://localhost:8000${item.thumbnail}`}
                alt=""
                width={120}
              />
            )}

            <h3>{item.title}</h3>
            <p>{item.summary}</p>

            <p>
              <b>Trạng thái:</b> {item.status_text}
            </p>

            <button onClick={() => startEdit(item)}>Sửa</button>

            {/* Nút Gửi duyệt */}
            {(item.status === "draft" || item.status === "rejected") && (
              <button
                className="submit-review-btn"
                onClick={() => handleSubmitReview(item.id)}
              >
                Gửi duyệt
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNews;
