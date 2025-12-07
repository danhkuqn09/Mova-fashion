import React from "react";

const DashboardCard = ({ title, value }) => {
  return (
    <div className="dashboard-card">
      <span className="card-title">{title}</span>
      <span className="card-value">{value ?? "..."}</span>
    </div>
  );
};

export default DashboardCard;
