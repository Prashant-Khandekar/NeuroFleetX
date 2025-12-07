import { Link, useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../../store/userStore";
import {
  FaTachometerAlt,
  FaBus,
  FaRoute,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaLocationArrow,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const { role, logout, user } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation(); // For active menu highlight

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate("/login"), 50);
  };

  // Sidebar menu with icons
  const menuItems = {
    admin: [
      { text: "Admin Dashboard", path: "/dashboard/admin", icon: <FaTachometerAlt /> },
      { text: "Manage Buses", path: "/dashboard/admin/buses", icon: <FaBus /> },
      { text: "Manage Routes", path: "/dashboard/admin/routes", icon: <FaRoute /> },
      { text: "Live Tracking", path: "/dashboard/admin/live-tracking", icon: <FaMapMarkedAlt /> },
    ],
    driver: [
      { text: "Driver Dashboard", path: "/dashboard/driver", icon: <FaTachometerAlt /> },
      { text: "My Route", path: "/dashboard/driver/routes", icon: <FaRoute /> },
      { text: "Live Location", path: "/dashboard/driver/live-tracking", icon: <FaLocationArrow /> },
    ],
    passenger: [
      { text: "Passenger Dashboard", path: "/dashboard/passenger", icon: <FaTachometerAlt /> },
      { text: "Live Bus Tracking", path: "/dashboard/passenger/live-tracking", icon: <FaMapMarkedAlt /> },
      { text: "Book Ticket", path: "/dashboard/passenger/book-ticket", icon: <FaTicketAlt /> },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaBus className="text-blue-600" /> NeuroFleetX
        </h2>

        <p className="text-gray-600 mb-4 flex items-center gap-2">
          <FaUser /> <span className="font-semibold">{user?.name}</span>
        </p>

        {/* Menu List */}
        <nav className="flex flex-col gap-2 mt-4 flex-grow">
          {menuItems[role]?.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer
                  ${active ? "bg-blue-600 text-white shadow-lg" : "text-gray-700 hover:bg-gray-200"}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 bg-red-500 text-white p-3 rounded-lg mt-6 hover:bg-red-600 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
