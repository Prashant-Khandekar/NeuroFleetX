import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const BUS_COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#9333ea", // purple
  "#f59e0b", // amber
];

export default function MapView({ buses = [] }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [73.8567, 18.5204],
      zoom: 12,
    });

    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;
  }, []);

  // Draw route per bus
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current;

    buses.forEach((bus, index) => {
      if (!bus.route || bus.route.length < 2) return;

      const sourceId = `route-${bus.id}`;
      const layerId = `route-line-${bus.id}`;

      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);

      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: bus.route,
          },
        },
      });

      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-width": 4,
          "line-color": BUS_COLORS[index % BUS_COLORS.length],
        },
      });
    });
  }, [mapLoaded, buses]);

  // Add / Update markers
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current;

    buses.forEach((bus, index) => {
      const color = BUS_COLORS[index % BUS_COLORS.length];

      if (!markersRef.current[bus.id]) {
        const el = document.createElement("div");
        el.className =
          "px-2 py-1 text-xs font-bold text-white rounded-full shadow";
        el.style.backgroundColor = color;
        el.innerText = bus.number;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([bus.lng, bus.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<b>Bus:</b> ${bus.number}<br/>
               <b>Driver:</b> ${bus.driver}<br/>
               <b>Speed:</b> ${bus.speed} km/h`
            )
          )
          .addTo(map);

        markersRef.current[bus.id] = marker;
      } else {
        markersRef.current[bus.id].setLngLat([bus.lng, bus.lat]);
      }
    });
  }, [mapLoaded, buses]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] rounded-xl shadow-lg"
    />
  );
}
