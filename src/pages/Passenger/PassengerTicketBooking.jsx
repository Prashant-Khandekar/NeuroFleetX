import { useState,useEffect } from "react";
import useThemeStore from "../../store/themeStore";
import api from '../../services/api';
import { useNavigate } from "react-router-dom";

export default function PassengerTicketBooking() {
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [availableTrips, setAvailableTrips] = useState([]);
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId") || "user_123";

  const bgCard = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const btnPrimary = darkMode
    ? "bg-[#3a3a3a] hover:bg-[#4a4a4a]"
    : "bg-[#8a8a8a] hover:bg-[#7a7a7a]";

   useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Fetch History
        const historyRes = await api.get(`/bookings/user/${userId}`);
        if(historyRes.data) setBookings([...historyRes.data].reverse());
        
        
        const busRes = await api.get('/buses'); 
        if(busRes.data) setAvailableTrips(busRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }finally {
        setLoading(false);
      }
    };
    initData();
  }, [userId]);



const handleBooking = async () => {
    if (!selectedTrip || !date) return alert("Select trip & date");
     
   const idFromTrip = selectedTrip._id || selectedTrip.id;


  if (!idFromTrip) {
    console.error("No ID found in:", selectedTrip);
    return alert("Bus ID missing. Please check console.");
  }

  try {
      const payload = {
      userId: "user_123", 
      busId: idFromTrip,
      routeName: selectedTrip.route?.name || "General Route",
      travelDate: date,
      passengers: parseInt(passengers) || 1, 
      //seatNumber: Math.floor(Math.random() * 40) + 1,
      status: "CONFIRMED"
    };

    console.log("Sending Booking Payload:", payload);


      const res = await api.post('/bookings/book', payload);
      if (res.status === 200 || res.status === 201) {
        alert("🎟 Ticket Booked Successfully!");
        navigate("/dashboard/passenger");
      }
    } catch (err) {
      alert("Booking Error: " + (err.response?.data || "Server down"));
    }
  };
  
  if (loading) return <div className="p-10 text-center font-bold">Fetching Real-time Buses...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* ================= AVAILABLE TRIPS ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-5">Available Bus Trips</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {availableTrips.map((trip) => {
             const totalCount = trip.totalSeats || trip.capacity || 0;
           const availableCount = (trip.availableSeats !== undefined && trip.availableSeats !== null && trip.availableSeats !== 0) 
    ? trip.availableSeats 
    
    : (totalCount - (trip.reservedSeats || 0));

            return (
              <div
                key={trip.id || trip._id || Math.random()}
                onClick={() => setSelectedTrip(trip)}
                className={`p-6 rounded-xl border cursor-pointer transition
                ${bgCard}
                ${
                 (selectedTrip?.id === trip.id || selectedTrip?._id === trip._id)
                    ? "ring-2 ring-black"
                    : ""
                }`}
              >
                <h2 className="text-xl font-semibold mb-2">
                  {trip.routeName || "General Route"}
                </h2>

                <p><strong>Bus:</strong> {trip.busNumber}</p>
                <p><strong>Route Path:</strong> 
  <span className="ml-2 text-blue-600 font-medium">
  {trip.route?.origin} → 
    {trip.route?.stops?.length > 0 && 
      ` ${trip.route.stops.map(stop => stop.name).join(" → ")} → `
    }
    {trip.route?.destination}
  </span>
</p>
                <p><strong>Total Seats:</strong> {totalCount}</p>
                <p><strong>Reserved:</strong> {trip.reservedSeats ?? (trip.capacity - (trip.availableSeats || 0))}</p>
                <p><strong>Available:</strong> {trip.availableSeats ?? 0}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= BOOKING FORM ================= */}
      <div className={`p-6 rounded-xl border ${bgCard}`}>
        <h2 className="text-2xl font-semibold mb-4">Book Selected Trip</h2>

        {selectedTrip ? (
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 rounded border"
            />

            <input
              type="number"
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="p-3 rounded border"
            />

            <button
              onClick={handleBooking}
              className={`p-3 rounded-lg font-semibold ${btnPrimary}`}
            >
              Confirm Booking
            </button>
          </div>
        ) : (
          <p>Select a trip to continue booking</p>
        )}
      </div>

      {/* ================= BOOKING HISTORY ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Booking History</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Route</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Seat No.</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="p-3">{b.routeName || "N/A"}</td>
                    <td className="p-3">{b.travelDate || "No Date"}</td>
                    <td className="p-3 text-center">{b.seatNumber}</td>
                    <td className="p-3 text-center font-semibold">
                      {b.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
