import { useEffect } from "react";
import MapView from "../../components/map/MapView";
import useBusLocationStore from "../../store/busLocationStore";
import useDriverRouteStore from "../../store/driverRouteStore";
import useThemeStore from "../../store/themeStore";

export default function LiveTracking() {
  const { buses, updateBusLocation } = useBusLocationStore();
  const { driverRouteCoordinates } = useDriverRouteStore();
  const { darkMode } = useThemeStore();

  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#e5e5e5] border-[#cfcfcf]";

  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";

  useEffect(() => {
    const interval = setInterval(() => {
      buses.forEach((bus) => {
        updateBusLocation(
          bus.id,
          bus.lat + (Math.random() - 0.5) * 0.001,
          bus.lng + (Math.random() - 0.5) * 0.001,
          Math.floor(Math.random() * 60)
        );
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [buses, updateBusLocation]);

  const getStatus = (speed) => {
    if (speed === 0) return "Stopped";
    if (speed < 20) return "Slow";
    return "Moving";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Live Bus Tracking</h1>
        <p className={textMuted}>
          Monitor all buses, drivers, and routes in real time.
        </p>
      </div>

      {/* Map */}
      <div className={`p-4 rounded-xl border shadow ${cardBg}`}>
        <MapView buses={buses} route={driverRouteCoordinates} />
      </div>

      {/* Bus Table */}
      <div className={`rounded-xl border shadow ${cardBg}`}>
        <table className="w-full text-sm">
          <thead className={darkMode ? "bg-[#3a3a3a]" : "bg-gray-300"}>
            <tr>
              <th className="p-3 text-left">Bus No.</th>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Speed</th>
              <th className="p-3 text-left">Latitude</th>
              <th className="p-3 text-left">Longitude</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {buses.map((bus) => (
              <tr
                key={bus.id}
                className="border-t border-gray-500/30 hover:bg-black/5"
              >
                <td className="p-3 font-semibold">{bus.number}</td>
                <td className="p-3">{bus.driver}</td>
                <td className="p-3">{bus.speed} km/h</td>
                <td className="p-3">{bus.lat.toFixed(4)}</td>
                <td className="p-3">{bus.lng.toFixed(4)}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      getStatus(bus.speed) === "Moving"
                        ? "bg-green-600 text-white"
                        : getStatus(bus.speed) === "Slow"
                        ? "bg-yellow-500 text-black"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {getStatus(bus.speed)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
