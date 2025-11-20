import React from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "../admin.css";

const Orders = () => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <h1>Quản lý đơn hàng</h1>
                </div>
            </div>
        </div>
    );
};

export default Orders;
