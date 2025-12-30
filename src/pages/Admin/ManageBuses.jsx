import { useState,useEffect } from "react";
import api from "../../services/api";
import useBusStore from "../../store/busStore";
import useThemeStore from "../../store/themeStore";

export default function ManageBuses() {
    const { buses, addBus, updateBus, deleteBus, setBuses } = useBusStore();
    const { darkMode } = useThemeStore();
    const cardBg = darkMode ? "bg-[#2f2f2f]" : "bg-[#b3b3b3]";

  const tableHover = darkMode ? "hover:bg-[#3a3a3a]" : "hover:bg-gray-200";

  const inputBg = darkMode

    ? "bg-[#1f1f1f] border-[#3d3d3d] text-white"

    : "bg-[#d0d0d0] border-[#9e9e9e]";

    // Local States
    const [routes, setRoutes] = useState([]); // To store routes for the dropdown
    const [showModal, setShowModal] = useState(false);
    const [editingBus, setEditingBus] = useState(null); // Track if we are editing
    const [form, setForm] = useState({
        busNumber: "",
        driverName: "",
        capacity: "",
        status: "Active",
        routeId: ""
    });

     // to fetch data from the backend

   useEffect(() => {

    const fetchBuses = async () => {
        try {
        const response = await api.get('/buses');
            setBuses(response.data);
            console.log("Backend Data:", response.data);
            const routeResponse = await api.get('/admin/routes') 

            setRoutes(routeResponse.data); 

            console.log("Routes in Dropdown:", routeResponse.data);

        } catch (error) {

            console.error("Error fetching buses:", error);

        }

    };

    fetchBuses();

    }, []);// [] means that the page will be loaded only once



    // 🎯 Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this bus?")) {
            try {
                await api.delete(`/buses/${id}`);
                deleteBus(id);
                alert("Bus deleted successfully!");
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };


    // 🎯 Handle Add/Update Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const busPayload = {
                busNumber: form.busNumber,
                driverName: form.driverName,
                capacity: form.capacity,
                status: form.status,
                route: { id: form.routeId } // Linking Route as an object
            };
             // Check if we are editing or adding new

        if (editingBus) {

            // STEP 1: If editing, use PUT request with the specific ID

            const response = await api.put(`/buses/${editingBus.id || editingBus._id}`, busPayload);

            

            // Update the frontend store/state

            updateBus(response.data); 

            alert("Bus updated successfully!");

        } else {

            // STEP 2: If no editingBus, create a new entry

            const response = await api.post('/buses', busPayload);

            addBus(response.data);

            alert("New bus added successfully!");

        }



        // Common cleanup after both actions

        setShowModal(false);

        setEditingBus(null); // Reset editing state

        setForm({ busNumber: "", driverName: "", capacity: "", status: "Active", routeId: "" });

    } catch (error) {

        console.error("Operation failed:", error);

        alert("Error saving bus data!");

    }

};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Buses</h1>
        <button
          onClick={() => {
            setEditingBus(null);
            setForm({ busNumber: "", driverName: "", capacity: "", status: "Active" });
            setShowModal(true);
          }}
          className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-80"
        >
          + Add Bus
        </button>
      </div>

      <div className={`rounded-xl border shadow ${cardBg}`}>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Bus</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className={`${tableHover} border-b`}>
                <td className="p-3">{bus.busNumber}</td>
                <td className="p-3">{bus.driverName || "No Driver"}</td>
                <td className="p-3">{bus.capacity}</td>
                <td className="p-3">{bus.status}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setEditingBus(bus);
                      setForm({
                        busNumber: bus.busNumber,
                         driverName: bus.driverName,
                           capacity: bus.capacity,
                             status: bus.status,
                              routeId: bus.route?.id || bus.route?._id || "" 
                              });
                      setShowModal(true);
                    }}
                    className="px-3 py-1 bg-gray-700 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id)}
                    className="px-3 py-1 bg-black text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className={`p-6 rounded-xl w-full max-w-md ${cardBg}`}>
            <h2 className="text-xl font-semibold mb-4">
              {editingBus ? "Edit Bus" : "Add Bus"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
             {["busNumber", "driverName", "capacity"].map((field) => (
                <input
                  key={field}
                  placeholder={field.toUpperCase()}
                  className={`w-full p-2 rounded border ${inputBg}`}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  required
                />
              ))}

              <select
                className={`w-full p-2 rounded border ${inputBg}`}
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <select 
                 value={form.routeId} 
                 onChange={(e) => setForm({...form, routeId: e.target.value})}
                  className={`w-full p-2 border rounded mb-4 ${inputBg}`}
                      >
                      <option value="">Select Route</option>
                        {routes && routes.length > 0 ? (
    routes.map(r => (
      <option key={r.id || r._id} value={r.id || r._id}>
        {/* If 'name' is empty, show origin and destination */}
        {r.name ? r.name : `${r.origin} to ${r.destination}`} 
      </option>
    ))
  ) : (
    <option disabled>Loading or No Routes Found...</option>
  )}
</select>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
