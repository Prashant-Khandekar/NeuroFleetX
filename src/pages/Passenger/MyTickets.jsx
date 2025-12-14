import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import usePassengerBookingStore from "../../store/passengerBookingStore";
import useThemeStore from "../../store/themeStore";

export default function MyTickets() {
  const navigate = useNavigate();
  const { darkMode } = useThemeStore();

  const bookings =
    usePassengerBookingStore((state) => state.bookings) || [];

  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";

  /* ================= EMPTY STATE ================= */
  if (bookings.length === 0) {
    return (
      <div className={`p-10 rounded-xl border shadow ${cardBg}`}>
        <h2 className="text-2xl font-semibold mb-3">
          No Tickets Found
        </h2>
        <p className={`${textMuted} mb-6`}>
          You haven’t booked any tickets yet.
        </p>

        <button
          onClick={() =>
            navigate("/dashboard/passenger/book-ticket")
          }
          className="px-6 py-3 rounded-lg bg-black text-white hover:opacity-80 transition"
        >
          Book Your First Ticket
        </button>
      </div>
    );
  }

  /* ================= TICKET LIST ================= */
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Tickets</h1>

      {bookings.map((ticket, index) => {
        if (!ticket) return null;

        const {
          id,
          routeName,
          travelDate,
          passengers,
          busNumber,
          status,
          stops = [],
          totalSeats,
          reservedSeats,
        } = ticket;

        const qrData = JSON.stringify({
          ticketId: id,
          route: routeName,
          date: travelDate,
          passengers,
          bus: busNumber,
        });

        return (
          <div
            key={id || index}
            className={`p-6 rounded-xl border shadow ${cardBg}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* INFO */}
              <div className="md:col-span-2 space-y-2">
                <h2 className="text-xl font-semibold">
                  {routeName}
                </h2>

                <p><strong>Date:</strong> {travelDate}</p>
                <p><strong>Passengers:</strong> {passengers}</p>
                <p><strong>Bus:</strong> {busNumber}</p>
                <p><strong>Status:</strong> {status}</p>

                <p>
                  <strong>Seats:</strong>{" "}
                  {reservedSeats ?? 0}/{totalSeats ?? "—"}
                </p>

                {Array.isArray(stops) && stops.length > 0 && (
                  <div>
                    <strong>Stops:</strong>
                    <ul className="list-disc list-inside">
                      {stops.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* QR */}
              <div className="flex flex-col items-center justify-center">
                <QRCodeCanvas
                  value={qrData}
                  size={140}
                  bgColor={darkMode ? "#2f2f2f" : "#b3b3b3"}
                  fgColor={darkMode ? "#ffffff" : "#000000"}
                />
                <p className="text-sm mt-2">
                  Show this QR to conductor
                </p>
              </div>
            </div>

            {status === "ACTIVE" && (
              <button
                onClick={() =>
                  navigate("/dashboard/passenger/live-tracking")
                }
                className="mt-6 px-5 py-2 rounded-lg bg-black text-white hover:opacity-80"
              >
                Track This Trip
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
