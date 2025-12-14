import { Routes, Route } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";

// Home Page
import Home from "./pages/Home/Home";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Dashboards
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DriverDashboard from "./pages/Dashboard/DriverDashboard";
import PassengerDashboard from "./pages/Dashboard/PassengerDashboard";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Admin Pages
import ManageBuses from "./pages/Admin/ManageBuses";
import ManageRoutes from "./pages/Admin/ManageRoutes";
import ManageDrivers from "./pages/Admin/ManageDrivers";
import LiveTracking from "./pages/Admin/LiveTracking";

// Passenger Pages
import PassengerTicketBooking from "./pages/Passenger/PassengerTicketBooking";
import PassengerLiveTracking from "./pages/Passenger/PassengerLiveTracking";
import MyTickets from "./pages/Passenger/MyTickets";

// Driver Pages
import MyRoute from "./pages/Driver/MyRoute";
import DriverLiveLocation from "./pages/Driver/LiveLocation";

// Other
import NotAuthorized from "./pages/NotAuthorized";

// Protected Routes
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <Routes>

      {/* Home Page */}
      <Route path="/" element={<Home />} />

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

          <Route
            path="/dashboard/admin/routes"
            element={
              <DashboardLayout>
                <ManageRoutes />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/admin/drivers"
            element={
              <DashboardLayout>
                <ManageDrivers />
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard/admin/live-tracking"
            element={
              <DashboardLayout>
                <LiveTracking />
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
          <Route
            path="/dashboard/driver/my-route"
            element={
              <DashboardLayout>
                <MyRoute />
              </DashboardLayout>
            }
          />   
          <Route
            path="/dashboard/driver/live-tracking"
            element={
              <DashboardLayout>
                <DriverLiveLocation />
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

          {/* ✅ FIX ADDED HERE */}
          <Route
            path="/dashboard/passenger/book-ticket"
            element={
              <DashboardLayout>
                <PassengerTicketBooking />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/passenger/live-tracking"
            element={
              <DashboardLayout>
                <PassengerLiveTracking />
              </DashboardLayout>
            }
          />     
          <Route
            path="/dashboard/passenger/my-tickets"
            element={
              <DashboardLayout>
                <MyTickets />
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
