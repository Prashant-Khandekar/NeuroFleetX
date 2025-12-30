import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaRoute, FaMapMarkerAlt, FaBus } from "react-icons/fa"; 
import api from "../../services/api";
import useThemeStore from "../../store/themeStore";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); 
  const { darkMode } = useThemeStore();
  const [isTracking, setIsTracking] = useState(localStorage.getItem("isTripStarted") === "true");
  const [routeStops, setRouteStops] = useState([]);
  const [busNumber, setBusNumber] = useState("");
  const [availableBuses, setAvailableBuses] = useState([]); 


  const toggleTrip = () => {
  const newStatus = !isTracking;
  setIsTracking(newStatus);
  
  //saving to the memory
  localStorage.setItem("isTripStarted", newStatus);
  
  if (newStatus) {
    console.log("🚀 Trip Started and Saved to Memory");
  } else {
    console.log("🛑 Trip Stopped");
   
  }
};

  
  const busId = searchParams.get("busId");

  
useEffect(() => {
  const savedBusId = localStorage.getItem("selectedBusId");
  
  
  if (!busId && savedBusId) {
    setSearchParams({ busId: savedBusId });
    console.log("📦 Memory se Bus ID recover ki gayi:", savedBusId);
  }
}, []); 

  
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await api.get("/buses"); 
        setAvailableBuses(res.data);
      } catch (err) {
        console.error("❌ Error fetching buses list:", err);
      }
    };
    fetchBuses();
  }, []);

  
  useEffect(() => {
    if (!busId) return;

    const fetchBusDetails = async () => {
      try {
        const res = await api.get(`/buses/${busId}`); 
        setBusNumber(res.data.busNumber);
        if (res.data.route && res.data.route.stops) {
          setRouteStops(res.data.route.stops);
          console.log("📍 Route Stops Loaded for:", res.data.busNumber);
        }
      } catch (err) {
        console.error("❌ Error fetching bus details:", err);
        setRouteStops([]);
      }
    };
    fetchBusDetails();
  }, [busId]);

  
  useEffect(() => {
    let interval;
    let stopIndex = 0;
    if (isTracking && routeStops.length > 0) {
      interval = setInterval(() => {
        const currentStop = routeStops[stopIndex];
        api.post("/buses/update", {
          busId: busId,
          latitude: currentStop.latitude,
          longitude: currentStop.longitude,
          status: "Moving"
        })
        .then(() => console.log(`✅ ${busNumber} at: ${currentStop.name}`))
        .catch(err => console.error("❌ API Error:", err.message));

        stopIndex = (stopIndex + 1) % routeStops.length;
      }, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [isTracking, busId, routeStops, busNumber]);

  
  const handleBusChange = (e) => {
    const selectedId = e.target.value;
    setIsTracking(false); 
   if (selectedId) {
    
    localStorage.setItem("selectedBusId", selectedId); 
    setSearchParams({ busId: selectedId });
  } else {
  
    localStorage.removeItem("selectedBusId"); 
    setSearchParams({});
  }
  };

  const cardBg = darkMode ? "bg-[#2f2f2f] border-[#3d3d3d]" : "bg-white border-gray-300";
  const actionBtn = "p-5 rounded-xl border shadow transition flex flex-col items-center hover:shadow-lg w-full";

 return (
  <div className="space-y-6 p-4">
    <h1 className="text-3xl font-bold">Driver Dashboard</h1>

    {/* 🎯 Dropdown UI Section */}
    <div className={`${cardBg} p-6 rounded-2xl border-2 shadow-sm`}>
      <label className="block mb-2 font-semibold flex items-center gap-2">
        <FaBus className="text-blue-500" /> Select Your Bus:
      </label>
      <select 
        onChange={handleBusChange}
        value={busId || ""}
        className="w-full p-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-blue-500"
      >
        <option value="" className="text-black">-- Choose a Bus --</option>
        {availableBuses.map((bus) => (
          <option key={bus.id} value={bus.id} className="text-black">
            {bus.busNumber} ({bus.route?.origin} - {bus.route?.destination})
          </option>
        ))}
      </select>
    </div>
    
    {busId ? (
      <div className={`p-8 rounded-2xl border-2 text-center ${isTracking ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <p className="font-bold mb-2 text-black text-xl uppercase tracking-wider">
          Bus: <span className="text-blue-600">{busNumber || "Loading..."}</span>
        </p>
        <p className="font-bold mb-4 text-black italic">
          STATUS: {isTracking ? "LIVE TRACKING ACTIVE" : "READY TO START"}
        </p>
        
     
        <button
          onClick={toggleTrip}
          className={`px-10 py-3 rounded-full font-bold text-white transition-all shadow-md active:scale-95 ${
            isTracking ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isTracking ? "STOP TRIP" : "START TRIP"}
        </button>
      </div>
    ) : (
      <div className="text-center p-10 border-2 border-dashed rounded-2xl">
        <p className="text-gray-500">Please select a bus from the dropdown to start your trip.</p>
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button onClick={() => navigate(`/dashboard/driver/my-route?busId=${busId}`)} className={`${actionBtn} ${cardBg}`}>
          <FaRoute size={30} className="mb-3 text-blue-500" />
          <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-black'}`}>My Route</span>
        </button>
        <button onClick={() => navigate("/dashboard/driver/live-tracking")} className={`${actionBtn} ${cardBg}`}>
          <FaMapMarkerAlt size={30} className="mb-3 text-orange-500" />
          <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-black'}`}>Track Map</span>
        </button>
    </div>
  </div>
);
}