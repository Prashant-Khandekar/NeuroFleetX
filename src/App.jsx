import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Dashboards
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DriverDashboard from "./pages/Dashboard/DriverDashboard";
import PassengerDashboard from "./pages/Dashboard/PassengerDashboard";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Other Pages
import ManageBuses from "./pages/Admin/ManageBuses";
import NotAuthorized from "./pages/NotAuthorized";

// Protected Routes
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>

        {/* ADMIN */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route
            path="/dashboard/admin"
            element={
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            }
          />
          <Route
              path="/dashboard/admin/buses"
              element={
                <DashboardLayout>
                  <ManageBuses />
                </DashboardLayout>
              }
          />
        </Route>

        {/* DRIVER */}
        <Route element={<RoleRoute allowedRoles={["driver"]} />}>
          <Route
            path="/dashboard/driver"
            element={
              <DashboardLayout>
                <DriverDashboard />
              </DashboardLayout>
            }
          />
        </Route>

        {/* PASSENGER */}
        <Route element={<RoleRoute allowedRoles={["passenger"]} />}>
          <Route
            path="/dashboard/passenger"
            element={
              <DashboardLayout>
                <PassengerDashboard />
              </DashboardLayout>
            }
          />
        </Route>

      </Route>

      {/* Not Authorized */}
      <Route path="/not-authorized" element={<NotAuthorized />} />

    </Routes>
  );
}

export default App;
