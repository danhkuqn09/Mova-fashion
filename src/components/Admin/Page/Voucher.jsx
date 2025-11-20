import React from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

import "../admin.css";

const Voucher = () => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <h1>Quản lý Voucher</h1>
                </div>
            </div>
        </div>
    );
};

export default Voucher;
