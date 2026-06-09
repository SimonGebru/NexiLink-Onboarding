import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../components/layouts/DashboardLayout";

import DashboardHome from "../pages/DashboardHome";
import OnboardingOverview from "../pages/OnboardingOverview";
import CreateProgram from "../pages/CreateProgram";
import AssignOnboarding from "../pages/AssignOnboarding";
import UploadMaterial from "../pages/UploadMaterial.jsx";
import ProgramBuilderSelection from "../pages/ProgramBuilderSelection.jsx";
import ChecklistBuilder from "../pages/ChecklistBuilder.jsx";
import QuizBuilder from "../pages/QuizBuilder.jsx";
import OnboardingDetails from "../pages/OnboardingDetails";
import Employees from "../pages/Employees";
import AcceptInvite from "../pages/AcceptInvite.jsx";
import TakeQuiz from "../pages/TakeQuiz.jsx"
import MyQuizzes from "../pages/MyQuizzes.jsx"; 

import UserOnboarding from "../pages/MyOnboardings.jsx";
import UserOnboardingDetails from "../pages/UserOnboardingDetails";
import UserDashboard from "../pages/UserDashboard";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Inbox from "../pages/Inbox.jsx";

import RoleProtectedRoute from "../auth/RoleProtectedRoute";
import { isLoggedIn, getUser } from "../auth/auth";

function getDefaultRouteByRole() {
  const user = getUser();
  const role = user?.role;

  if (role === "employee") {
    return "/my/dashboard";
  }

  return "/dashboard";
}

export default function AppRouter() {
  const defaultRoute = getDefaultRouteByRole();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isLoggedIn() ? <Navigate to={defaultRoute} replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn() ? <Navigate to={defaultRoute} replace /> : <Register />
        }
      />

      <Route
        path="/accept-invite"
        element={
          isLoggedIn() ? (
            <Navigate to={defaultRoute} replace />
          ) : (
            <AcceptInvite />
          )
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          isLoggedIn() ? (
            <Navigate to={defaultRoute} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["admin"]}
            redirectTo="/my/dashboard"
          />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/onboarding" element={<OnboardingOverview />} />
          <Route path="/employees" element={<Employees />} />

          <Route path="/programs/new" element={<CreateProgram />} />
          <Route path="/programs/:id/material" element={<UploadMaterial />} />
          <Route
            path="/programs/:id/builders"
            element={<ProgramBuilderSelection />}
          />
          <Route
            path="/programs/:id/checklist"
            element={<ChecklistBuilder />}
          />
          <Route path="/programs/:id/quiz" element={<QuizBuilder />} />

          <Route path="/onboarding/assign" element={<AssignOnboarding />} />
          <Route path="/onboardings/:id" element={<OnboardingDetails />} />
          <Route path="/admin/inbox" element={<Inbox />} />
        </Route>
      </Route>

      {/* EMPLOYEE ROUTES */}
      <Route
        element={
          <RoleProtectedRoute
            allowedRoles={["employee"]}
            redirectTo="/dashboard"
          />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route path="/my/onboardings" element={<UserOnboarding />} />
          <Route path="/my/dashboard" element={<UserDashboard />} />
          <Route
            path="/my/onboarding/:id"
            element={<UserOnboardingDetails />}
          />
          <Route path="/my/inbox" element={<Inbox />} />
          <Route path="/my/quiz/:id/quiz" element={<TakeQuiz />} />
          <Route path="/my/quizzes" element={<MyQuizzes />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          isLoggedIn() ? (
            <Navigate to={defaultRoute} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
