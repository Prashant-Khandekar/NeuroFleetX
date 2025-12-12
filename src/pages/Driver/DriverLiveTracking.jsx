import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import MapView from "../../components/maps/MapView";
import useBusLocationStore from "../../store/busLocationStore";

export default function DriverLiveTracking() {
  const { busLocation, updateBusLocation } = useBusLocationStore();

  const [sharing, setSharing] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Fake driver route points (Polyline)
  const routePoints = [
    [73.8567, 18.5204], // Pune
    [73.8620, 18.5280],
    [73.8705, 18.5352],
    [73.8801, 18.5407],
    [73.8920, 18.5450],
  ];

  // Convert route into GeoJSON format
  const routeGeoJson = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: routePoints,
    },
  };

  // Start sharing driver live location
  const startLiveTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        updateBusLocation({
          id: 1, // driver’s bus id (temporary)
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    setWatchId(id);
    setSharing(true);
  };

  // Stop live tracking
  const stopLiveTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    setSharing(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Driver Live Tracking</h1>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        {!sharing ? (
          <button
            onClick={startLiveTracking}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ▶ Start Sharing Live Location
          </button>
        ) : (
          <button
            onClick={stopLiveTracking}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ⏹ Stop Sharing
          </button>
        )}
      </div>

      {/* Map Visualization */}
      <div className="rounded-xl overflow-hidden shadow-lg">
        <MapView
          buses={[
            {
              id: 1,
              lat: busLocation?.lat || 18.5204,
              lng: busLocation?.lng || 73.8567,
            },
          ]}
          route={routeGeoJson}
        />
      </div>
    </DashboardLayout>
  );
}
