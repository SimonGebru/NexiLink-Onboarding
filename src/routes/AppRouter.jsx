import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../components/layouts/DashboardLayout";

import DashboardHome from "../pages/DashboardHome";
import OnboardingOverview from "../pages/OnboardingOverview";
import CreateProgram from "../pages/CreateProgram";
import AssignOnboarding from "../pages/AssignOnboarding";
import UploadMaterial from "../pages/UploadMaterial.jsx";
import ChecklistBuilder from "../pages/ChecklistBuilder.jsx";
import OnboardingDetails from "../pages/OnboardingDetails";

import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "../auth/ProtectedRoute";
import { isLoggedIn } from "../auth/auth";

function Placeholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes (utan DashboardLayout) */}
      <Route
        path="/login"
        element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={
          isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      {/* Start: skicka till login om inte inloggad, annars dashboard */}
      <Route
        path="/"
        element={
          isLoggedIn() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected/App routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/onboarding" element={<OnboardingOverview />} />

          <Route path="/employees" element={<Placeholder title="Employees" />} />

          <Route path="/programs/new" element={<CreateProgram />} />
          <Route path="/programs/:id/material" element={<UploadMaterial />} />
          <Route path="/programs/:id/checklist" element={<ChecklistBuilder />} /> 

          <Route path="/onboarding/assign" element={<AssignOnboarding />} />
          <Route path="/onboardings/:id" element={<OnboardingDetails />} />
        </Route>
      </Route>

      {/* Fallback: om okänd route  login om ej inloggad, annars dashboard */}
      <Route
        path="*"
        element={
          isLoggedIn() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}