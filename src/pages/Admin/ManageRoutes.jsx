import { useState } from "react";
import useRouteStore from "../../store/routeStore";

export default function ManageRoutes() {
  const { routes, addRoute, updateRoute, deleteRoute } = useRouteStore();

  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form, setForm] = useState({
    name: "",
    origin: "",
    destination: "",
    stops: "",
  });

  const openAddModal = () => {
    setEditingRoute(null);
    setForm({ name: "", origin: "", destination: "", stops: "" });
    setShowModal(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route.id);
    setForm(route);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingRoute) updateRoute(editingRoute, form);
    else addRoute(form);

    setShowModal(false);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Manage Routes</h1>

      <button
        onClick={openAddModal}
        className="mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Add New Route
      </button>

      <div className="bg-white rounded-lg shadow p-5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3">Route Name</th>
              <th className="p-3">Origin</th>
              <th className="p-3">Destination</th>
              <th className="p-3">Stops</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{route.name}</td>
                <td className="p-3">{route.origin}</td>
                <td className="p-3">{route.destination}</td>
                <td className="p-3">{route.stops}</td>

                <td className="p-3 text-center flex gap-3 justify-center">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => openEditModal(route)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => deleteRoute(route.id)}
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
              {editingRoute ? "Edit Route" : "Add New Route"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Route Name"
                className="w-full p-2 border rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Origin"
                className="w-full p-2 border rounded"
                value={form.origin}
                onChange={(e) =>
                  setForm({ ...form, origin: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Destination"
                className="w-full p-2 border rounded"
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Number of Stops"
                className="w-full p-2 border rounded"
                value={form.stops}
                onChange={(e) =>
                  setForm({ ...form, stops: e.target.value })
                }
                required
              />

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
                  {editingRoute ? "Save Changes" : "Add Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
