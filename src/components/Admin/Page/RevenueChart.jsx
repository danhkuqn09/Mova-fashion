import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const RevenueChart = ({ title, labels, data, type = "bar" }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Doanh thu (₫)",
        data,
        backgroundColor: "rgba(52, 152, 219, 0.6)",
        borderColor: "#3498db",
        borderWidth: 2,
        fill: type === "line",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white fw-bold">{title}</div>
      <div className="card-body">
        {type === "line" ? (
          <Line data={chartData} />
        ) : (
          <Bar data={chartData} />
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
