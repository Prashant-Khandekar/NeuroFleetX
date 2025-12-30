import { useState, useEffect} from "react";
import api from "../../services/api"; 
import useDriverStore from "../../store/driverStore";
import useThemeStore from "../../store/themeStore";

export default function ManageDrivers() {
 const { drivers, setDrivers, addDriver, deleteDriver, updateDriver } = useDriverStore();
  const { darkMode } = useThemeStore();

  const cardBg = darkMode ? "bg-[#2f2f2f]" : "bg-[#b3b3b3]";
  const inputBg = darkMode
    ? "bg-[#1f1f1f] border-[#3d3d3d] text-white"
    : "bg-[#d0d0d0] border-[#9e9e9e]";

  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license: "",
    status: "Active",
  });

  useEffect(() => {
        const fetchDrivers = async () => {
            try {
                // Fetch data from your backend controller path
                const response = await api.get('/admin/drivers');
                
                // Fill the Zustand store with the database records
                setDrivers(response.data); 
                console.log("Data successfully fetched from MongoDB");
            } catch (error) {
                console.error("Error loading drivers:", error);
            }
        };

        fetchDrivers();
    }, [setDrivers]); // Dependency array ensures it runs once on mount

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editingDriver) {
            // Update existing driver: PUT request
            // Path: /api/admin/drivers/{id}
            const response = await api.put(`/admin/drivers/${editingDriver}`, form);
            
            // Update the Zustand store with the edited data
            updateDriver(response.data); 
            alert("Driver updated successfully!");
        } else {
            // Create new driver: POST request
            const response = await api.post('/admin/drivers', form);
            addDriver(response.data);
            alert("New driver added successfully!");
        }

        // Close modal and reset state
        setShowModal(false);
        setEditingDriver(null);
        setForm({ name: "", phone: "", license: "", status: "Active" });
    } catch (error) {
        console.error("Save failed:", error);
        alert("Error saving data to database.");
    }
};
  // Function to handle permanent deletion from backend and frontend
const handleDelete = async (id) => {
    // Basic validation to ensure an ID is passed
    if (!id) {
        console.error("No driver ID provided for deletion");
        return;
    }

    if (window.confirm("Are you sure you want to delete this driver?")) {
        try {
            // Send DELETE request to the backend API endpoint
            await api.delete(`/admin/drivers/${id}`); 
            
            // Remove the driver from the local Zustand store state
            deleteDriver(id); 
            
            alert("Driver deleted successfully from the database.");
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed! Please check if the backend server is running.");
        }
    }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Drivers</h1>
        <button
          onClick={() => {
            setEditingDriver(null);
            setForm({ name: "", phone: "", license: "", status: "Active" });
            setShowModal(true);
          }}
          className="px-5 py-2 bg-black text-white rounded-lg"
        >
          + Add Driver
        </button>
      </div>

      <div className={`rounded-xl border shadow ${cardBg}`}>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">License</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.phone}</td>
                <td className="p-3">{d.license}</td>
                <td className="p-3">{d.status}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setEditingDriver(d.id);
                      setForm(d);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 bg-gray-700 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                  onClick={() => handleDelete(d.id)}
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
              {editingDriver ? "Edit Driver" : "Add Driver"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {["name", "phone", "license"].map((field) => (
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
