import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API = "http://localhost:3000/api";

const Dashboard = () => {
  const [statusData, setStatusData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchStatusStats();
    fetchTimelineStats();
  }, []);

  const fetchStatusStats = async () => {
    const res = await axios.get(`${API}/stats/status`, {
      headers: getAuthHeaders(),
    });
    const formatted = Object.entries(res.data).map(([status, count]) => ({
      name: status,
      value: parseInt(count),
    }));
    setStatusData(formatted);
  };

  const fetchTimelineStats = async () => {
    const res = await axios.get(`${API}/stats/timeline`, {
      headers: getAuthHeaders(),
    });
    const formatted = res.data.map((item) => ({
      date: item.date,
      count: parseInt(item.count),
    }));
    setTimelineData(formatted);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#E91E63"];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">📊 Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Applications by Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Applications Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#0088FE" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
