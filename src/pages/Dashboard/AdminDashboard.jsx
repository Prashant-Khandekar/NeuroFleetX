import { FaBus, FaRoute, FaUsers, FaPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/common/DashboardCard";
import useThemeStore from "../../store/themeStore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useThemeStore();

  // Mock data (backend will replace later)
  const stats = {
    totalBuses: 42,
    activeBuses: 31,
    totalRoutes: 12,
    totalDrivers: 18,
  };

  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";

  const actionBtn =
    "p-5 rounded-xl border shadow transition hover:shadow-lg hover:scale-[1.02] bg-black text-white";

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className={textMuted}>
          Control buses, routes, drivers and monitor live operations.
        </p>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Buses"
          value={stats.totalBuses}
          icon={FaBus}
        />
        <DashboardCard
          title="Active Buses"
          value={stats.activeBuses}
          icon={FaPlayCircle}
        />
        <DashboardCard
          title="Total Routes"
          value={stats.totalRoutes}
          icon={FaRoute}
        />
        <DashboardCard
          title="Total Drivers"
          value={stats.totalDrivers}
          icon={FaUsers}
        />
      </div>

      {/* ================= SYSTEM OVERVIEW ================= */}
      <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
        <h2 className="text-xl font-semibold mb-2">
          System Overview
        </h2>
        <p className={textMuted}>
          NeuroFleetX helps you centrally manage public transport operations —
          from assigning routes and drivers to tracking buses live on the map.
        </p>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <button
            onClick={() => navigate("/dashboard/admin/buses")}
            className={actionBtn}
          >
            🚍 Manage Buses
            <p className="text-sm text-gray-300 mt-1">
              Add, update or deactivate buses
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/admin/routes")}
            className={actionBtn}
          >
            🛣️ Manage Routes
            <p className="text-sm text-gray-300 mt-1">
              Define routes and stops
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/admin/live-tracking")}
            className={actionBtn}
          >
            📡 Live Tracking
            <p className="text-sm text-gray-300 mt-1">
              Monitor all buses in real time
            </p>
          </button>

        </div>
      </div>

    </div>
  );
}
