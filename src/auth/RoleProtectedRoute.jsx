import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, getUser } from "./auth";

export default function RoleProtectedRoute({ allowedRoles = [], redirectTo = "/login" }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  const userRole = user?.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}