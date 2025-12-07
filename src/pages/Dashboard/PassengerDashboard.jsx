import { useNavigate } from "react-router-dom";

export default function PassengerDashboard() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-3">Passenger Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome! Manage your travel, book tickets, and track buses in real-time.
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        {/* Live Tracking */}
        <div
          onClick={() => navigate("/dashboard/passenger/live-tracking")}
          className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Live Bus Tracking</h2>
          <p className="text-gray-600">
            Track buses in real-time on the city map.
          </p>
        </div>

        {/* Book Ticket */}
        <div
          onClick={() => navigate("/dashboard/passenger/book-ticket")}
          className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Book Ticket</h2>
          <p className="text-gray-600">
            Choose your destination and reserve your seat instantly.
          </p>
        </div>

        {/* My Tickets */}
        <div
          onClick={() => navigate("/dashboard/passenger/my-tickets")}
          className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">My Tickets</h2>
          <p className="text-gray-600">
            View your active and past tickets.
          </p>
        </div>
      </div>

      {/* Upcoming Trip (Mock Data) */}
      <h2 className="text-2xl font-semibold mb-3">Upcoming Trip</h2>

      <div className="bg-white p-5 rounded-xl shadow mb-10">
        <p className="text-gray-700 mb-1">
          <strong>Route:</strong> Pune Station → Hinjewadi Phase 3
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Time:</strong> Tomorrow 9:00 AM
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Seat:</strong> 12
        </p>
        <p className="text-gray-700">
          <strong>Status:</strong> Confirmed
        </p>
      </div>

      {/* Simple Stats */}
      <h2 className="text-2xl font-semibold mb-3">Travel Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Trips Completed</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">14</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Tickets Booked</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">23</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Favorite Route</h3>
          <p className="text-xl mt-2 font-medium">Katraj → Swargate</p>
        </div>
      </div>
    </>
  );
}
