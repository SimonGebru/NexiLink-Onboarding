import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getUser, isLoggedIn, logout, setUser } from "./auth";
import { getMe } from "../services/authService";

export default function RoleProtectedRoute({
  allowedRoles = [],
  redirectTo = "/login",
}) {
  const location = useLocation();
  const normalizedAllowedRoles = useMemo(
    () =>
      (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).filter(
        Boolean,
      ),
    [allowedRoles],
  );

  const [loading, setLoading] = useState(isLoggedIn());
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    let alive = true;

    async function boot() {
      if (!isLoggedIn()) {
        if (alive) setLoading(false);
        return;
      }

      const existing = getUser();
      const hasNeededFields =
        !!existing?.role &&
        (existing.role !== "employee" || !!existing.employeeId);

      if (hasNeededFields) {
        if (alive) setLoading(false);
        return;
      }

      try {
        if (!alive) return;
        setLoading(true);
        setBootError("");

        const res = await getMe();
        const user = res?.user ?? res;
        if (!alive) return;

        setUser(user);
      } catch (e) {
        if (!alive) return;
        logout();
        setBootError(e?.message || "Du behöver logga in igen.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    boot();
    return () => {
      alive = false;
    };
  }, []);

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          Laddar…
        </div>
      </div>
    );
  }

  if (bootError) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  const userRole = user?.role;

  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
