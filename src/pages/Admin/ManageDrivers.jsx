import { useState } from "react";
import useDriverStore from "../../store/driverStore";
import useThemeStore from "../../store/themeStore";

export default function ManageDrivers() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useDriverStore();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    editingDriver ? updateDriver(editingDriver, form) : addDriver(form);
    setShowModal(false);
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
                    onClick={() => deleteDriver(d.id)}
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
