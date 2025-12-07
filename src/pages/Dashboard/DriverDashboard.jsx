import { FaRoute, FaPlayCircle, FaMapMarkerAlt } from "react-icons/fa";

export default function DriverDashboard() {
  const nextTrip = {
    bus: "MH12 AB 4421",
    route: "Katraj → Swargate → Pune Station",
    startTime: "08:30 AM",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>

      {/* Driver Info */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold">Next Trip</h2>
        <p className="mt-2 text-gray-700"><strong>Bus:</strong> {nextTrip.bus}</p>
        <p className="text-gray-700"><strong>Route:</strong> {nextTrip.route}</p>
        <p className="text-gray-700"><strong>Start Time:</strong> {nextTrip.startTime}</p>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <button className="bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700 transition flex flex-col items-center">
          <FaRoute size={28} className="mb-2" />
          My Route
        </button>

        <button className="bg-green-600 text-white p-4 rounded-xl shadow hover:bg-green-700 transition flex flex-col items-center">
          <FaPlayCircle size={28} className="mb-2" />
          Start Trip
        </button>

        <button className="bg-purple-600 text-white p-4 rounded-xl shadow hover:bg-purple-700 transition flex flex-col items-center">
          <FaMapMarkerAlt size={28} className="mb-2" />
          Live Location
        </button>

      </div>
    </div>
  );
}
