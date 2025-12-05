import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyNew.css"; 

const MyNews = () => {
  const [loading, setLoading] = useState(true);
  const [myNews, setMyNews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // 🔹 state toggle form
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: "",
    summary: "",
    content: "",
    thumbnail: null,
  });

  const token = localStorage.getItem("token");
  console.log(token);
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchMyNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/news/my-news", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setMyNews(res.data.data.news);
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

  const resetForm = () => {
    setIsEditing(false);
    setForm({ id: null, title: "", summary: "", content: "", thumbnail: null });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("summary", form.summary);
    formData.append("content", form.content);
    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);

    try {
      await axios.post("http://localhost:8000/api/news", formData, axiosConfig);
      alert("Tạo bài viết thành công!");
      resetForm();
      setIsFormOpen(false);
      fetchMyNews();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo bài viết");
    }
  };

  const startEdit = (item) => {
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

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="my-news-container">
      {/* 🔹 Nút tạo bài viết */}
      <button className="create-btn" onClick={() => { setIsFormOpen(!isFormOpen); resetForm(); }}>
        {isFormOpen ? "Đóng form" : "Tạo bài viết"}
      </button>

      {/* 🔹 Form */}
      {isFormOpen && (
        <form className="my-news-form" onSubmit={isEditing ? handleCreate : handleCreate}>
          <input type="text" placeholder="Tiêu đề" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Tóm tắt" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
          <textarea placeholder="Nội dung" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <input type="file" onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })} />
          <button type="submit">{isEditing ? "Cập nhật" : "Tạo bài viết"}</button>
        </form>
      )}

      {/* 🔹 Danh sách bài viết */}
      <div className="my-news-list">
        <h2>Bài viết của tôi</h2>
        {myNews.map((item) => (
          <div key={item.id} className="mynew-item">
            {item.thumbnail && <img src={`http://localhost:8000/storage/news/${item.thumbnail}`} alt="" width={120} />}
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <p><b>Trạng thái:</b> {item.status_text}</p>
            <button onClick={() => startEdit(item)}>Sửa</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNews;
