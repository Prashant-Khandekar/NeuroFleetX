import { useEffect } from "react";
import MapView from "../../components/map/MapView";
import useBusLocationStore from "../../store/busLocationStore";
import useDriverTripStore from "../../store/driverTripStore";
import useThemeStore from "../../store/themeStore";

export default function DriverLiveTracking() {
  const { darkMode } = useThemeStore();
  const { buses } = useBusLocationStore();
  const bus = buses[0]; // 🔥 Assigned bus (mock)

  const {
    route,
    tripActive,
    currentStopIndex,
    startTrip,
    endTrip,
    advanceStop,
    getETA,
  } = useDriverTripStore();

  const eta =
    tripActive && bus
      ? getETA(bus.lat, bus.lng, bus.speed || 30)
      : null;

  const cardBg = darkMode
    ? "bg-[#2b2b2b] border-[#3a3a3a]"
    : "bg-[#b0b0b0] border-[#9a9a9a]";

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Driver Live Location</h1>

      {/* MAP */}
      <MapView
        buses={[bus]}
        route={route.stops.map((s) => [s.lng, s.lat])}
      />

      {/* ROUTE PROGRESS */}
      <div className={`p-6 rounded-xl border ${cardBg}`}>
        <h2 className="text-xl font-semibold mb-3">
          Route Progress
        </h2>

        <ul className="space-y-2">
          {route.stops.map((stop, index) => (
            <li
              key={stop.name}
              className={`flex justify-between p-2 rounded ${
                index < currentStopIndex
                  ? "bg-green-600 text-white"
                  : index === currentStopIndex
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
            >
              <span>{stop.name}</span>
              {index === currentStopIndex && "🚌"}
            </li>
          ))}
        </ul>

        {tripActive && eta && (
          <p className="mt-4 font-semibold">
            ⏱ ETA to next stop: {eta} min
          </p>
        )}

        <div className="flex gap-4 mt-4">
          {!tripActive ? (
            <button
              onClick={startTrip}
              className="px-4 py-2 bg-black text-white rounded"
            >
              ▶ Start Trip
            </button>
          ) : (
            <>
              <button
                onClick={advanceStop}
                className="px-4 py-2 bg-gray-700 text-white rounded"
              >
                Next Stop
              </button>

              <button
                onClick={endTrip}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                End Trip
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
