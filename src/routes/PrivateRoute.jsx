import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/userStore";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
  const { token, loadUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();     // load from localStorage
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
