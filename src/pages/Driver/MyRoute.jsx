import useThemeStore from "../../store/themeStore";
import useDriverRouteStore from "../../store/driverRouteStore";

export default function MyRoute() {
  const { darkMode } = useThemeStore();
  const { assignedRoute } = useDriverRouteStore();

  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const mutedText = darkMode ? "text-gray-300" : "text-gray-700";

  if (!assignedRoute) {
    return (
      <div className={`p-8 rounded-xl border shadow ${cardBg}`}>
        <h1 className="text-2xl font-bold mb-2">My Route</h1>
        <p className={mutedText}>
          No route has been assigned to you yet.
        </p>
        <p className={`${mutedText} mt-2`}>
          Please wait for admin to assign your route.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-1">My Route</h1>
        <p className={mutedText}>
          Your assigned route and trip details
        </p>
      </div>

      {/* ================= ROUTE SUMMARY ================= */}
      <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <p><strong>Route:</strong> {assignedRoute.routeName}</p>
            <p><strong>Bus Number:</strong> {assignedRoute.busNumber}</p>
            <p><strong>Distance:</strong> {assignedRoute.distance}</p>
          </div>

          <div>
            <p><strong>Start Time:</strong> {assignedRoute.startTime}</p>
            <p><strong>End Time:</strong> {assignedRoute.endTime}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="font-semibold">
                {assignedRoute.status}
              </span>
            </p>
          </div>

        </div>
      </div>

      {/* ================= STOPS LIST ================= */}
      <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
        <h2 className="text-xl font-semibold mb-4">
          Stops ({assignedRoute.totalStops})
        </h2>

        <ol className="space-y-2 list-decimal list-inside">
          {assignedRoute.stops.map((stop, index) => (
            <li
              key={index}
              className="px-4 py-2 rounded-lg bg-black/20"
            >
              {stop}
            </li>
          ))}
        </ol>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
        <h2 className="text-xl font-semibold mb-3">
          Driver Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <button className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-80 transition">
            Start Trip
          </button>

          <button className="px-5 py-2 rounded-lg bg-[#444] text-white hover:opacity-80 transition">
            View Live Map
          </button>

          <button className="px-5 py-2 rounded-lg bg-[#666] text-white hover:opacity-80 transition">
            Report Issue
          </button>
        </div>
      </div>

    </div>
  );
}
