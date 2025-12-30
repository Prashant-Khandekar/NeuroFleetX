import { useState,useEffect } from "react";
import api from "../../services/api";
import useRouteStore from "../../store/routeStore";
import useThemeStore from "../../store/themeStore";

export default function ManageRoutes() {
  const { routes, setRoutes, addRoute, updateRoute, deleteRoute } = useRouteStore();
  const { darkMode } = useThemeStore();

  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form, setForm] = useState({
    name: "",
    origin: "",
    destination: "",
    stops: 0,
  });
  const formFields = ["name", "origin", "destination", "stops"];

  // Fetch routes from Backend on page load
useEffect(() => {
    const fetchRoutes = async () => {
        try {
            const response = await api.get('/admin/routes');
            setRoutes(response.data); // This fills your table
            console.log("Routes loaded:", response.data);
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    };
    fetchRoutes();
}, [setRoutes]); // Run once on mount



  const cardBg = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const tableHeader = darkMode ? "bg-[#242424]" : "bg-[#a6a6a6]";
  const rowHover = darkMode ? "hover:bg-[#3a3a3a]" : "hover:bg-[#9e9e9e]";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";

  const inputBg = darkMode
    ? "bg-[#1f1f1f] border-[#3d3d3d] text-[#e5e5e5]"
    : "bg-[#cfcfcf] border-[#9e9e9e] text-[#1b1b1b]";

  const primaryBtn =
    "bg-black text-white hover:opacity-80 transition rounded-lg";

  const openAddModal = () => {
    setEditingRoute(null);
    setForm({ name: "", origin: "", destination: "", stops: [{ name: "", latitude: "", longitude: "", sequenceOrder: 1 }] });
    setShowModal(true);
  };

  const addStopRow = () => {
  setForm({
    ...form,
    stops: [...form.stops, { name: "", latitude: "", longitude: "", sequenceOrder: form.stops.length + 1 }]
  });
};

const handleStopChange = (index, field, value) => {
  const newStops = [...form.stops];
  newStops[index][field] = field === "name" ? value : parseFloat(value) || 0;
  setForm({ ...form, stops: newStops });
};

const openEditModal = (route) => {
  setEditingRoute(route.id || route._id);
  setForm({
    name: route.name,
    origin: route.origin,
    destination: route.destination,
   
    stops: Array.isArray(route.stops) && typeof route.stops[0] === 'object'
      ? route.stops 
      : [{ name: "", latitude: 0, longitude: 0, sequenceOrder: 1 }]
  });
  setShowModal(true);
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingRoute) {
      const response = await api.put(`/admin/routes/${editingRoute}`, form);
      updateRoute(response.data);
      alert("Route updated!");
    } else {
      const response = await api.post('/admin/routes', form);
      addRoute(response.data);
      alert("Route added!");
    }
    setShowModal(false);
  } catch (error) {
    console.error("Error:", error);
    alert("Server Error!");
  }
};
const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route permanently?")) {
        try {
            //deletion from mongodb
            await api.delete(`/admin/routes/${id}`);
            
           //removing from screen
            deleteRoute(id);
            alert("Route deleted!");
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }
};


  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Routes</h1>
        <p className={textMuted}>
          Create, update and manage bus routes and stops.
        </p>
      </div>

      {/* ================= ACTION ================= */}
      <div>
        <button
          onClick={openAddModal}
          className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-80 transition"
        >
          + Add New Route
        </button>
      </div>

      {/* ================= ROUTES TABLE ================= */}
      <div className={`rounded-xl border shadow ${cardBg}`}>
        <table className="w-full text-left border-collapse">
          <thead className={tableHeader}>
            <tr>
              <th className="p-4">Route Name</th>
              <th className="p-4">Origin</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Stops</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {routes.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No routes added yet.
                </td>
              </tr>
            )}

            {routes.map((route) => (
              <tr
                key={route.id}
                className={`border-t transition ${rowHover}`}
              >
                <td className="p-4 font-medium">{route.name}</td>
                <td className="p-4">{route.origin}</td>
                <td className="p-4">{route.destination}</td>
                <td className="p-4">{route.stops && Array.isArray(route.stops) 
   ? route.stops.map(s => (typeof s === 'object' ? s.name : s)).join(" → ")
    : "No stops added"}</td>

                <td className="p-4 text-center">
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => openEditModal(route)}
                      className="px-3 py-1 rounded bg-[#5a5a5a] text-white hover:opacity-80"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(route.id || route._id)}
                      className="px-3 py-1 rounded bg-[#8a2f2f] text-white hover:opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`p-6 rounded-xl border shadow-lg w-full max-w-md ${cardBg}`}>

            <h2 className="text-xl font-bold mb-4">
              {editingRoute ? "Edit Route" : "Add New Route"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Route Name"
                className={`w-full p-3 rounded-lg border outline-none ${inputBg}`}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Origin"
                className={`w-full p-3 rounded-lg border outline-none ${inputBg}`}
                value={form.origin}
                onChange={(e) =>
                  setForm({ ...form, origin: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Destination"
                className={`w-full p-3 rounded-lg border outline-none ${inputBg}`}
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                required
              />

             <div className="border-t border-gray-600 pt-3">
          <label className="text-sm font-semibold mb-2 block">Stops & Coordinates</label>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {form.stops.map((stop, index) => (
              <div key={index} className="space-y-2 p-3 rounded-lg bg-black/20 border border-gray-700">
                <input
                  type="text"
                  placeholder={`Stop ${index + 1} Name`}
                  className={`w-full p-2 text-sm rounded border outline-none ${inputBg}`}
                  value={stop.name}
                  onChange={(e) => handleStopChange(index, "name", e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    className={`w-1/2 p-2 text-sm rounded border outline-none ${inputBg}`}
                    value={stop.latitude}
                    onChange={(e) => handleStopChange(index, "latitude", e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    className={`w-1/2 p-2 text-sm rounded border outline-none ${inputBg}`}
                    value={stop.longitude}
                    onChange={(e) => handleStopChange(index, "longitude", e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStopRow}
            className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            + Add Another Stop
          </button>
        </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#7a7a7a] text-black hover:opacity-80"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-4 py-2 ${primaryBtn}`}
                >
                  {editingRoute ? "Save Changes" : "Add Route"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
