import MapView from "../../components/map/MapView";
import usePassengerBookingStore from "../../store/passengerBookingStore";
import useBusLocationStore from "../../store/busLocationStore";
import useDriverTripStore from "../../store/driverTripStore";
import useThemeStore from "../../store/themeStore";

export default function PassengerLiveTracking() {
  const { activeBooking } = usePassengerBookingStore();
  const { buses } = useBusLocationStore();
  const { darkMode } = useThemeStore();

  const {
    route,
    tripActive,
    currentStopIndex,
    getETA,
  } = useDriverTripStore();

  // 🚫 No active booking
  if (!activeBooking) {
    return (
      <div className="text-center mt-20 text-lg">
        No active trip found. Book a ticket to start tracking.
      </div>
    );
  }

  // 🚌 Only booked bus
  const bookedBus = buses.find(
    (bus) => bus.id === activeBooking.busId
  );

  const eta =
    tripActive && bookedBus
      ? getETA(bookedBus.lat, bookedBus.lng, bookedBus.speed || 30)
      : null;

  const cardBg = darkMode
    ? "bg-[#2b2b2b] border-[#3a3a3a]"
    : "bg-[#b0b0b0] border-[#9a9a9a]";

  const muted = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Live Trip Tracking</h1>
        <p className={muted}>
          Route: {activeBooking.routeName}
        </p>
      </div>

      {/* MAP */}
      <MapView
        buses={bookedBus ? [bookedBus] : []}
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

        {/* ETA */}
        {tripActive && eta ? (
          <p className="mt-4 font-semibold">
            ⏱ ETA to next stop: {eta} minutes
          </p>
        ) : (
          <p className={`mt-4 ${muted}`}>
            Waiting for driver to start the trip…
          </p>
        )}
      </div>
    </div>
  );
}
