import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import MapView from "../../components/map/MapView";
import api from "../../services/api";
import useThemeStore from "../../store/themeStore";
import { FaBus, FaClock, FaRoute } from "react-icons/fa";


// 🎯 Distance calculation helper (Haversine Formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export default function PassengerLiveTracking() {
  const { darkMode } = useThemeStore();
  const [searchParams] = useSearchParams();
  

  const busId = searchParams.get("busId") || "695128bbdb682bbbeea0eddf"; 

  const [busPos, setBusPos] = useState({ lat: 18.5204, lng: 73.8567 });
  const [routeStops, setRouteStops] = useState([]); // 🎯 Stops store karne ke liye
  const [busNumber, setBusNumber] = useState("Loading..."); // 🎯 Bus Number ke liye
  const [eta, setEta] = useState("--");

  // 1. TRIP DETAILS (Bus Number & Route) 
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        console.log("🔍 Fetching Details for Bus ID:", busId);
        const res = await api.get(`/buses/${busId}`);
        setBusNumber(res.data.busNumber || "N/A");
        if (res.data.route && res.data.route.stops) {
          setRouteStops(res.data.route.stops);
        }
      } catch (err) {
        console.error("Error fetching bus details:", err);
      }
    };
    fetchBusDetails();
  }, [busId]);

  // 2. LIVE LOCATION - updates after every 5 sec
useEffect(() => {
  if (!busId) return;

  const fetchLocation = async () => {
    try {
      const res = await api.get(`/buses/location/${busId}`);
      if (res.data) {
        // API  coordinates
        const currentLat = parseFloat(res.data.latitude);
        const currentLng = parseFloat(res.data.longitude);


        if (currentLat > 20) {
    console.log("Ignoring old Bhopal data...");
    return; 
  }
        
        setBusPos({ lat: currentLat, lng: currentLng });

        // 🎯 ETA Calculation Logic
        if (routeStops && routeStops.length > 0) {
          //  (Destination)  coordinates
          const dest = routeStops[routeStops.length - 1];
          
          // Distance  (KM)
          const dist = getDistance(
    parseFloat(busPos.lat), 
    parseFloat(busPos.lng), 
    parseFloat(dest.latitude), 
    parseFloat(dest.longitude)
);
          
          // Speed: 25 km/h ( average)
          const speed = 25; 
          const timeInMinutes = Math.round((dist / speed) * 60);

          console.log(`Distance: ${dist.toFixed(2)} km, ETA: ${timeInMinutes} mins`);

          if (timeInMinutes <= 1) {
            setEta("Arriving...");
          } else {
            setEta(`${timeInMinutes} mins`);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching bus location:", err);
    }
  };
   console.log("Current Bus Pos:", busPos)
  fetchLocation(); 
  const interval = setInterval(fetchLocation, 5000);
  return () => clearInterval(interval);
}, [busId, routeStops]); 
  const cardBg = darkMode ? "bg-[#2f2f2f] border-[#3d3d3d]" : "bg-white border-gray-200";

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Live Bus Tracking</h1>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
        {busPos.lat && busPos.lng ? (
          <MapView 
            buses={[{ id: busId, lat: parseFloat(busPos.lat), 
    lng: parseFloat(busPos.lng), name: busNumber }]} 
            stops={routeStops} 
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            Loading Live Map...
          </div>
        )}
      </div>

      {/* TRIP INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border shadow-sm ${cardBg} flex items-center gap-4`}>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FaBus size={20}/></div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Bus Number</p>
            <p className="font-bold text-lg">{busNumber}</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border shadow-sm ${cardBg} flex items-center gap-4`}>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><FaClock size={20}/></div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Estimated Arrival</p>
            <p className="font-bold text-lg">{eta}</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border shadow-sm ${cardBg} flex items-center gap-4`}>
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><FaRoute size={20}/></div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Trip Status</p>
            <p className="font-bold text-green-600 text-lg">On Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}