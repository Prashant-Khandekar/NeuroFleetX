import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const BUS_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b"];

export default function MapView({ buses = [], stops = [] }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef({});
  const stopMarkersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 1. Initialize map (Standard Light Mode)
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", 
      center: [73.8567, 18.5204], // Pune Center
      zoom: 11,
    });

    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;
  }, []);

  // 2.  DRAW ROUTE LINE & AUTO-ZOOM
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || stops.length < 1) return;
    const map = mapRef.current;

    const sourceId = "route-polyline";
    const layerId = "route-layer";

    // Stops coordinates: [lng, lat]
    const coordinates = stops.map(s => [s.longitude, s.latitude]);

    // Update or Add Source
    if (map.getSource(sourceId)) {
      map.getSource(sourceId).setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: coordinates },
      });
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: coordinates },
        },
      });

      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 6,
          "line-opacity": 0.8
        },
      });
    }

    // 🎯 AUTO-ZOOM: setting the map according to the stops
    if (coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }

    // Draw Stop Markers
    stopMarkersRef.current.forEach(m => m.remove());
    stopMarkersRef.current = stops.map(stop => {
      const el = document.createElement("div");
      el.className = "w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow-md";
      return new mapboxgl.Marker(el)
        .setLngLat([stop.longitude, stop.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<b>${stop.name}</b>`))
        .addTo(map);
    });

  }, [mapLoaded, stops]);

  // Add / Update Bus markers
useEffect(() => {
  if (!mapLoaded || !mapRef.current) return;
  const map = mapRef.current;

  buses.forEach((bus, index) => {
  // 1. Data Cleaning: checking if data is valid or not
  const lat = parseFloat(bus.lat);
  const lng = parseFloat(bus.lng);

  if (isNaN(lat) || isNaN(lng)) {
    console.warn("Invalid coordinates for bus:", bus);
    return;
  }

  // 2. Mapbox
  const coordinates = [lng, lat]; 

  const color = BUS_COLORS[index % BUS_COLORS.length];

  if (!markersRef.current[bus.id]) {
    const el = document.createElement("div");
    el.className = "flex flex-col items-center"; 

    // Bus Label
    const label = document.createElement("div");
    label.className = "mb-1 px-2 py-0.5 text-[10px] font-bold text-white rounded shadow-sm";
    label.style.backgroundColor = color;
    label.innerText = bus.name || "BUS";

    // Bus Dot
    const dot = document.createElement("div");
    dot.className = "w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse";
    dot.style.backgroundColor = color;

    el.appendChild(label);
    el.appendChild(dot);

    // creating marker
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom' 
    })
      .setLngLat(coordinates) 
      .addTo(map);

    markersRef.current[bus.id] = marker;
  } else {
    // updating marker position
    markersRef.current[bus.id].setLngLat(coordinates);
  }
});
}, [mapLoaded, buses]);

  return (
    <div ref={mapContainerRef} className="w-full h-full min-h-[400px] rounded-xl overflow-hidden" />
  );
}