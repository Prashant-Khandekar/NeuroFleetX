import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({ buses = [], route = [] }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Map ---------------------------------------------------
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [73.8567, 18.5204], // Pune default
      zoom: 12,
    });

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;
  }, []);

  // Draw Route AFTER MAP LOAD ----------------------------------------
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current;

    if (!route || route.length === 0) return;

    const routeGeoJSON = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };

    // Remove existing
    if (map.getSource("driverRoute")) {
      map.removeLayer("driverRouteLine");
      map.removeSource("driverRoute");
    }

    map.addSource("driverRoute", { type: "geojson", data: routeGeoJSON });

    map.addLayer({
      id: "driverRouteLine",
      type: "line",
      source: "driverRoute",
      paint: {
        "line-width": 4,
        "line-color": "#007bff",
      },
    });
  }, [mapLoaded, route]);

  // Add / Update MARKERS AFTER MAP LOAD ------------------------------
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current;

    buses.forEach((bus) => {
      if (!markersRef.current[bus.id]) {
        // Create marker for new bus
        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat([bus.lng, bus.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<b>${bus.number}</b>`))
          .addTo(map);

        markersRef.current[bus.id] = marker;
      } else {
        // Update marker position
        markersRef.current[bus.id].setLngLat([bus.lng, bus.lat]);
      }
    });
  }, [mapLoaded, buses]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] rounded-lg shadow-lg"
    ></div>
  );
}
