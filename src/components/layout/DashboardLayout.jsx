import { Link, useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../../store/userStore";
import useThemeStore from "../../store/themeStore";
import {
  FaTachometerAlt,
  FaBus,
  FaRoute,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaLocationArrow,
  FaUser,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const { role, logout, user } = useUserStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const savedBusId = localStorage.getItem("selectedBusId");

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate("/login"), 50);
  };

  const menuItems = {
    admin: [
      { text: "Dashboard", path: "/dashboard/admin", icon: <FaTachometerAlt /> },
      { text: "Manage Buses", path: "/dashboard/admin/buses", icon: <FaBus /> },
      { text: "Manage Routes", path: "/dashboard/admin/routes", icon: <FaRoute /> },
      { text: "Manage Drivers", path: "/dashboard/admin/drivers", icon: <FaUser /> },
      { text: "Live Tracking", path: "/dashboard/admin/live-tracking", icon: <FaMapMarkedAlt /> },
    ],
    driver: [
      { text: "Dashboard", path: "/dashboard/driver", icon: <FaTachometerAlt /> },
      { text: "My Route", path:savedBusId ? `/dashboard/driver/my-route?busId=${savedBusId}` : "/dashboard/driver/my-route", icon: <FaRoute /> },
      { text: "Live Location", path: savedBusId ? `/dashboard/driver/live-tracking?busId=${savedBusId}` :"/dashboard/driver/live-tracking", icon: <FaLocationArrow /> },
    ],
    passenger: [
      { text: "Dashboard", path: "/dashboard/passenger", icon: <FaTachometerAlt /> },
      { text: "Book Ticket", path: "/dashboard/passenger/book-ticket", icon: <FaTicketAlt /> },
      { text: "My Tickets", path: "/dashboard/passenger/my-tickets", icon: <FaTicketAlt /> },
      { text: "Live Tracking", path: "/dashboard/passenger/live-tracking", icon: <FaMapMarkedAlt /> },
    ],
  };

  /* 🎨 THEME CLASSES */
  const sidebarBg = darkMode ? "bg-[#1e1e1e]" : "bg-white";
  const mainBg = darkMode ? "bg-[#121212]" : "bg-gray-100";
  const textColor = darkMode ? "text-gray-200" : "text-gray-800";
  const mutedText = darkMode ? "text-gray-400" : "text-gray-600";
  const activeItem = darkMode
    ? "bg-white text-black"
    : "bg-black text-white";

  return (
    <div className={`flex min-h-screen ${mainBg} ${textColor}`}>

      {/* SIDEBAR */}
      <aside className={`w-64 p-6 flex flex-col shadow-xl ${sidebarBg}`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaBus /> NeuroFleetX
        </h2>

        <p className={`mb-4 flex items-center gap-2 ${mutedText}`}>
          <FaUser /> <span className="font-semibold">{user?.name}</span>
        </p>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-2 mt-4 flex-grow">
          {menuItems[role]?.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition
                  ${
                    active
                      ? activeItem
                      : darkMode
                      ? "hover:bg-[#2a2a2a]"
                      : "hover:bg-gray-200"
                  }`}
              >
                {item.icon}
                {item.text}
              </Link>
            );
          })}
        </nav>

        {/* 🌙 DARK MODE TOGGLE */}
        <button
          onClick={toggleDarkMode}
          className={`flex items-center justify-between gap-3 p-3 rounded-lg mb-4 transition
            ${darkMode ? "bg-[#2a2a2a]" : "bg-gray-200"}`}
        >
          <div className="flex items-center gap-3">
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
