import React from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

import "../admin.css";

const Users = () => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <h1>Quản lý người dùng</h1>
                </div>
            </div>
        </div>
    );
};

export default Users;
