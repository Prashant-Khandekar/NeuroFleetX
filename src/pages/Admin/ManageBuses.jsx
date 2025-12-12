import { useState } from "react";
import useBusStore from "../../store/busStore";

export default function ManageBuses() {
  const { buses, addBus, updateBus, deleteBus } = useBusStore();

  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [form, setForm] = useState({
    number: "",
    driver: "",
    capacity: "",
    status: "Active",
  });

  const openAddModal = () => {
    setEditingBus(null);
    setForm({ number: "", driver: "", capacity: "", status: "Active" });
    setShowModal(true);
  };

  const openEditModal = (bus) => {
    setEditingBus(bus.id);
    setForm(bus);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBus) updateBus(editingBus, form);
    else addBus(form);
    setShowModal(false);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Manage Buses</h1>

      <button
        onClick={openAddModal}
        className="mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Add New Bus
      </button>

      {/* Buses Table */}
      <div className="bg-white rounded-lg shadow p-5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3">Bus Number</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{bus.number}</td>
                <td className="p-3">{bus.driver}</td>
                <td className="p-3">{bus.capacity}</td>
                <td className="p-3">{bus.status}</td>
                <td className="p-3 text-center flex gap-3 justify-center">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => openEditModal(bus)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => deleteBus(bus.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBus ? "Edit Bus" : "Add New Bus"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Bus Number"
                className="w-full p-2 border rounded"
                value={form.number}
                onChange={(e) =>
                  setForm({ ...form, number: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Driver Name"
                className="w-full p-2 border rounded"
                value={form.driver}
                onChange={(e) =>
                  setForm({ ...form, driver: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Capacity"
                className="w-full p-2 border rounded"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
                required
              />

              <select
                className="w-full p-2 border rounded"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingBus ? "Save Changes" : "Add Bus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
