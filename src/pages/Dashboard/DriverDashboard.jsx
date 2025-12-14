import { useNavigate } from "react-router-dom";
import { FaRoute, FaPlayCircle, FaMapMarkerAlt } from "react-icons/fa";
import useThemeStore from "../../store/themeStore";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useThemeStore();

  // Mock upcoming trip (backend-ready)
  const nextTrip = {
    bus: "MH12 AB 4421",
    route: "Katraj → Swargate → Pune Station",
    startTime: "08:30 AM",
  };

  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";

  const actionBtn =
    "p-5 rounded-xl border shadow transition flex flex-col items-center hover:shadow-lg";

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Dashboard</h1>
        <p className={textMuted}>
          View assigned routes, start trips, and share live location.
        </p>
      </div>

      {/* ================= NEXT TRIP ================= */}
      <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
        <h2 className="text-xl font-semibold mb-3">Next Assigned Trip</h2>

        <p className="mb-1">
          <strong>Bus:</strong> {nextTrip.bus}
        </p>
        <p className="mb-1">
          <strong>Route:</strong> {nextTrip.route}
        </p>
        <p>
          <strong>Start Time:</strong> {nextTrip.startTime}
        </p>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* MY ROUTE */}
          <button
            onClick={() => navigate("/dashboard/driver/my-route")}
            className={`${actionBtn} ${cardBg}`}
          >
            <FaRoute size={30} className="mb-3" />
            <span className="font-semibold text-lg">My Route</span>
            <p className={`text-sm mt-1 ${textMuted}`}>
              View assigned stops & route map
            </p>
          </button>

          {/* START TRIP */}
          <button
            className={`${actionBtn} ${cardBg}`}
          >
            <FaPlayCircle size={30} className="mb-3" />
            <span className="font-semibold text-lg">Start Trip</span>
            <p className={`text-sm mt-1 ${textMuted}`}>
              Begin today’s scheduled trip
            </p>
          </button>

          {/* LIVE LOCATION */}
          <button
            onClick={() => navigate("/dashboard/driver/live-tracking")}
            className={`${actionBtn} ${cardBg}`}
          >
            <FaMapMarkerAlt size={30} className="mb-3" />
            <span className="font-semibold text-lg">Live Location</span>
            <p className={`text-sm mt-1 ${textMuted}`}>
              Share live bus location
            </p>
          </button>

        </div>
      </div>

    </div>
  );
}
