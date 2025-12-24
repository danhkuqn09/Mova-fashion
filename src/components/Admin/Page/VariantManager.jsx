import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Css/Product.css";

const VariantManager = () => {
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [colorForm, setColorForm] = useState({ name: "", color_code: "", image: "" });
    const [sizeForm, setSizeForm] = useState({ name: "" });
    const [editColorId, setEditColorId] = useState(null);
    const [editSizeId, setEditSizeId] = useState(null);

    // Fetch colors and sizes
    const fetchData = async () => {
        setLoading(true);
        try {
            const [colorRes, sizeRes] = await Promise.all([
                axios.get("http://localhost:8000/api/admin/colors"),
                axios.get("http://localhost:8000/api/admin/sizes"),
            ]);
            setColors(colorRes.data.data || []);
            setSizes(sizeRes.data.data || []);
        } catch (error) {
            alert("Lỗi khi lấy dữ liệu biến thể");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Color handlers
    const handleColorSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', colorForm.name);
            formData.append('color_code', colorForm.color_code);
            if (colorForm.image instanceof File) {
                formData.append('image', colorForm.image);
            }
            if (editColorId) {
                await axios.put(`http://localhost:8000/api/admin/colors/${editColorId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post("http://localhost:8000/api/admin/colors", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setColorForm({ name: "", color_code: "", image: "" });
            setEditColorId(null);
            fetchData();
        } catch (error) {
            alert("Lỗi khi lưu màu");
        }
    };
    const handleColorEdit = (color) => {
        setColorForm({ name: color.name, color_code: color.color_code || "", image: color.image || "" });
        setEditColorId(color.id);
    };
    const handleColorDelete = async (id) => {
        if (!window.confirm("Xóa màu này?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/admin/colors/${id}`);
            fetchData();
        } catch (error) {
            alert("Lỗi khi xóa màu");
        }
    };

    // Size handlers
    const handleSizeSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editSizeId) {
                await axios.put(`http://localhost:8000/api/admin/sizes/${editSizeId}`, sizeForm);
            } else {
                await axios.post("http://localhost:8000/api/admin/sizes", sizeForm);
            }
            setSizeForm({ name: "" });
            setEditSizeId(null);
            fetchData();
        } catch (error) {
            alert("Lỗi khi lưu size");
        }
    };
    const handleSizeEdit = (size) => {
        setSizeForm({ name: size.name });
        setEditSizeId(size.id);
    };
    const handleSizeDelete = async (id) => {
        if (!window.confirm("Xóa size này?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/admin/sizes/${id}`);
            fetchData();
        } catch (error) {
            alert("Lỗi khi xóa size");
        }
    };

    return (
        <div className="variant-manager">
            <div className="row">
                <div className="col-md-6">
                    <h5 className="mb-0"><i className="fas fa-palette me-2"></i>Quản lý Màu sắc</h5>
                    <form className="mb-3" onSubmit={handleColorSubmit}>
                        <div className="mb-2">
                            <input type="text" className="form-control" placeholder="Tên màu" value={colorForm.name} onChange={e => setColorForm({ ...colorForm, name: e.target.value })} required />
                        </div>
                        <div className="mb-2">
                            <input type="text" className="form-control" placeholder="Mã màu (hex)" value={colorForm.color_code} onChange={e => setColorForm({ ...colorForm, color_code: e.target.value })} />
                        </div>
                        <div className="mb-2">
                            <input type="file" className="form-control" accept="image/*" onChange={e => setColorForm({ ...colorForm, image: e.target.files[0] })} />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">{editColorId ? "Cập nhật" : "Thêm"}</button>
                        {editColorId && <button type="button" className="btn btn-secondary" onClick={() => { setEditColorId(null); setColorForm({ name: "", color_code: "", image: "" }); }}>Hủy</button>}
                    </form>
                    <ul className="list-group">
                        {colors.length === 0 ? (
                            <li className="list-group-item text-muted">Chưa có màu nào</li>
                        ) : colors.map(color => (
                            <li key={color.id} className="list-group-item d-flex align-items-center justify-content-between">
                                <span>
                                    <span className="badge me-2" style={{ background: color.color_code || "#eee", color: "#333" }}>{color.color_code || ""}</span>
                                    {color.name}
                                </span>
                                <span>
                                    <button className="btn btn-sm btn-warning me-1" onClick={() => handleColorEdit(color)}><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleColorDelete(color.id)}><i className="fas fa-trash"></i></button>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h5 className="mb-0"><i className="fas fa-ruler me-2"></i>Quản lý Size</h5>
                    <form className="mb-3" onSubmit={handleSizeSubmit}>
                        <div className="mb-2">
                            <input type="text" className="form-control" placeholder="Tên size" value={sizeForm.name} onChange={e => setSizeForm({ ...sizeForm, name: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">{editSizeId ? "Cập nhật" : "Thêm"}</button>
                        {editSizeId && <button type="button" className="btn btn-secondary" onClick={() => { setEditSizeId(null); setSizeForm({ name: "" }); }}>Hủy</button>}
                    </form>
                    <ul className="list-group">
                        {sizes.length === 0 ? (
                            <li className="list-group-item text-muted">Chưa có size nào</li>
                        ) : sizes.map(size => (
                            <li key={size.id} className="list-group-item d-flex align-items-center justify-content-between">
                                <span>{size.name}</span>
                                <span>
                                    <button className="btn btn-sm btn-warning me-1" onClick={() => handleSizeEdit(size)}><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleSizeDelete(size.id)}><i className="fas fa-trash"></i></button>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VariantManager;
