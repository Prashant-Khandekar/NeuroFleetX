import { useEffect, useState } from "react"; // Added useEffect & useState
import { useNavigate } from "react-router-dom";
import useThemeStore from "../../store/themeStore";9
import { getMyBookings } from "../../services/api"; // Added API call

export default function PassengerDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useThemeStore();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to store the selected bus/trip object

  // 🎯 Fetch bookings from Backend on load
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const userId = "user_123"; // Replace with your actual logged-in user ID
        const res = await getMyBookings(userId);
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserBookings();
  }, []);


  // 🎯 Find upcoming (active) booking
  const upcomingTrip = bookings.find(
    (b) => b.status === "CONFIRMED"
  );

  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";
  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Passenger Dashboard</h1>
        <p className={`${textMuted}`}>
          Manage your travel, book tickets, and track buses in real-time.
        </p>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div
          onClick={() => navigate("/dashboard/passenger/live-tracking")}
          className={`p-6 rounded-xl border shadow cursor-pointer transition hover:shadow-lg ${cardBg}`}
        >
          <h2 className="text-xl font-semibold mb-2">
            Live Bus Tracking
          </h2>
          <p className={textMuted}>
            Track your booked bus on the map.
          </p>
        </div>

        <div
          onClick={() => navigate("/dashboard/passenger/book-ticket")}
          className={`p-6 rounded-xl border shadow cursor-pointer transition hover:shadow-lg ${cardBg}`}
        >
          <h2 className="text-xl font-semibold mb-2">
            Book Ticket
          </h2>
          <p className={textMuted}>
            Choose routes and reserve your seat.
          </p>
        </div>

        <div
          onClick={() => navigate("/dashboard/passenger/book-ticket")}
          className={`p-6 rounded-xl border shadow cursor-pointer transition hover:shadow-lg ${cardBg}`}
        >
          <h2 className="text-xl font-semibold mb-2">
            My Tickets
          </h2>
          <p className={textMuted}>
            View active and past bookings.
          </p>
        </div>

      </div>

      {/* ================= UPCOMING TRIP ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Trip</h2>

        {upcomingTrip ? (
          <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
            <p className="mb-1">
              <strong>Route:</strong> {upcomingTrip.routeName}
            </p>
            <p className="mb-1">
              <strong>Date:</strong> {upcomingTrip.travelDate || "Not Available"}
            </p>
            <p className="mb-1">
              <strong>Seat Number:</strong> {upcomingTrip.seatNumber || "Assigned"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="font-semibold">
                {upcomingTrip.status}
              </span>
            </p>

            <button
              onClick={() =>
                navigate("/dashboard/passenger/live-tracking")
              }
              className="mt-4 px-5 py-2 rounded-lg bg-black text-white hover:opacity-80 transition"
            >
              Track This Trip
            </button>
          </div>
        ) : (
          <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
            <p className={`${textMuted} mb-4`}>
              You have no upcoming trips.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard/passenger/book-ticket")
              }
              className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-80 transition"
            >
              Book Your First Ticket
            </button>
          </div>
        )}
      </div>

      {/* ================= STATS ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Travel Stats</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
            <h3 className="text-lg font-semibold">Trips Completed</h3>
            <p className="text-3xl font-bold mt-2">
              {bookings.filter((b) => b.status === "COMPLETED").length}
            </p>
          </div>

          <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
            <h3 className="text-lg font-semibold">Tickets Booked</h3>
            <p className="text-3xl font-bold mt-2">
              {bookings.length}
            </p>
          </div>

          <div className={`p-6 rounded-xl border shadow ${cardBg}`}>
            <h3 className="text-lg font-semibold">Favorite Route</h3>
            <p className="text-xl mt-2 font-medium">
              {bookings[0]?.routeName || "—"}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
