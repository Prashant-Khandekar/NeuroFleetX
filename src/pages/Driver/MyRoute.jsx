import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useThemeStore from "../../store/themeStore";

export default function MyRoute() {
  const { darkMode } = useThemeStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(true);
 
const isTripActive = localStorage.getItem("isTripStarted") === "true";

  
  const busId = searchParams.get("busId");

 useEffect(() => {
  const fetchRouteInfo = async () => {
    
    const currentBusId = searchParams.get("busId") || localStorage.getItem("selectedBusId");

    if (!currentBusId) {
      console.warn("⚠️ No Bus ID found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
     
      const res = await api.get(`/buses/${currentBusId}`);
      
      if (res.data) {
        setBusData(res.data);
        
        localStorage.setItem("selectedBusId", currentBusId);
      }
    } catch (err) {
      console.error("❌ Error fetching route:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchRouteInfo();
}, [searchParams]); 

  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-white border-gray-200"; 
  const mutedText = darkMode ? "text-gray-300" : "text-gray-600";

  if (loading) {
    return <div className="p-10 text-center font-bold">🔄 Loading Live Route...</div>;
  }

 
  if (!busId || !busData || !busData.route) {
    return (
      <div className={`p-8 rounded-xl border shadow ${cardBg}`}>
        <h1 className="text-2xl font-bold mb-2">My Route</h1>
        <p className={mutedText}>No active route found for this selection.</p>
        <button 
          onClick={() => navigate("/dashboard/driver")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go to Dashboard to Select Bus
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-1">My Route</h1>
        <p className={mutedText}>
          Real-time route details for Bus: <span className="font-bold text-blue-500">{busData.busNumber}</span>
        </p>
      </div>

     {/* ================= ROUTE SUMMARY ================= */}
<div className={`p-6 rounded-xl border-2 shadow-sm ${cardBg}`}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      {/*  */}
      <p className="text-lg">
        <strong>Route:</strong> {busData.route?.origin} → {busData.route?.destination}
      </p>
      
      <p><strong>Route Name:</strong> {busData.route?.name}</p>
      <p><strong>Bus Number:</strong> <span className="uppercase text-blue-600 font-bold">{busData.busNumber}</span></p>
    </div>

    <div className="space-y-2 text-right md:text-left">
      <p><strong>Driver:</strong> {busData.driverName || "Not Assigned"}</p>
      <p><strong>Capacity:</strong> {busData.capacity} Seats</p>
     <p>
  <strong>Status:</strong>{" "}
  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
    isTripActive 
      ? 'bg-green-100 text-green-700'  
      : 'bg-red-100 text-red-700'      
  }`}>
    {isTripActive ? "ACTIVE" : "INACTIVE"}
  </span>
</p>
    </div>
  </div>
</div>

{/* ================= STOPS LIST ================= */}
<div className={`p-6 rounded-xl border-2 shadow-sm ${cardBg} mt-6`}>
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
     {/*  */}
     Stops ({busData.route?.stops?.length || 0})
  </h2>

  <div className="space-y-3">
    {busData.route?.stops?.map((stop, index) => (
      <div
        key={index}
        className={`flex items-center gap-4 px-4 py-4 rounded-xl border ${
          darkMode ? "bg-black/20 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex-none w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
          {index + 1}
        </div>
        <div className="flex-grow">
          {/*  */}
          <p className="font-semibold text-lg">{stop.name}</p>
          <div className="flex gap-4 text-xs text-gray-500 italic">
            <span>Lat: {stop.latitude}</span>
            <span>Lng: {stop.longitude}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* ================= ACTIONS ================= */}
      <div className={`p-6 rounded-xl border-2 shadow-sm ${cardBg}`}>
        <h2 className="text-xl font-semibold mb-3">Driver Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate(`/dashboard/driver?busId=${busId}`)}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-md"
          >
            Go to Tracking Console
          </button>

          <button 
            onClick={() => navigate("/dashboard/driver/live-tracking")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-md"
          >
            View Live Map
          </button>
        </div>
      </div>
    </div>
  );
}