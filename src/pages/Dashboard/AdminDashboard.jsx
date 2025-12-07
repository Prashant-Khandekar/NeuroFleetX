import { FaBus, FaRoute, FaUsers, FaPlayCircle } from "react-icons/fa";
import DashboardCard from "../../components/common/DashboardCard";

export default function AdminDashboard() {
  // Mock data (backend will replace later)
  const stats = {
    totalBuses: 42,
    activeBuses: 31,
    totalRoutes: 12,
    totalDrivers: 18,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <button className="bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700 transition">
            Manage Buses
          </button>

          <button className="bg-green-600 text-white p-4 rounded-xl shadow hover:bg-green-700 transition">
            Manage Routes
          </button>

          <button className="bg-purple-600 text-white p-4 rounded-xl shadow hover:bg-purple-700 transition">
            Live Tracking
          </button>

        </div>
      </div>
    </div>
  );
}
