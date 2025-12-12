import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/userStore";
import { useEffect, useState } from "react";

export default function RoleRoute({ allowedRoles }) {
  const { role, loadUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}
