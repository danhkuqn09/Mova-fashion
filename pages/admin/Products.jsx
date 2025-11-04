import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import DashboardCard from "../../components/admin/DashboardCard";
import "../../styles/admin.css"; 

const Products = () => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <h1>Quản lý sản phẩm</h1>
                </div>
            </div>
        </div>
    );
};

export default Products;
