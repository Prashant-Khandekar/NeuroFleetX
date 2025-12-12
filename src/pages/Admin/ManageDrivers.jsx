import { useState } from "react";
import useDriverStore from "../../store/driverStore";

export default function ManageDrivers() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useDriverStore();

  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license: "",
    status: "Active",
  });

  const openAddModal = () => {
    setEditingDriver(null);
    setForm({ name: "", phone: "", license: "", status: "Active" });
    setShowModal(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver.id);
    setForm(driver);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingDriver) updateDriver(editingDriver, form);
    else addDriver(form);

    setShowModal(false);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Manage Drivers</h1>

      <button
        onClick={openAddModal}
        className="mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Add New Driver
      </button>

      <div className="bg-white rounded-lg shadow p-5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">License No.</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{driver.name}</td>
                <td className="p-3">{driver.phone}</td>
                <td className="p-3">{driver.license}</td>
                <td className="p-3">{driver.status}</td>

                <td className="p-3 text-center flex gap-3 justify-center">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => openEditModal(driver)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => deleteDriver(driver.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              {editingDriver ? "Edit Driver" : "Add New Driver"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Driver Name"
                className="w-full p-2 border rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 border rounded"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="License Number"
                className="w-full p-2 border rounded"
                value={form.license}
                onChange={(e) =>
                  setForm({ ...form, license: e.target.value })
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
                    {editingDriver ? "Save Changes" : "Add Driver"}
                  </button>
                </div>
              </form>
            </div>
          </div>
      )}
    </>
  );
}
