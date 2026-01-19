import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import UploadMaterial from "../pages/UploadMaterial.jsx";
import ChecklistBuilder from "../pages/ChecklistBuilder.jsx";
import DashboardLayout from "../components/layouts/DashboardLayout";
import OnboardingOverview from "../pages/OnboardingOverview";
import CreateProgram from "../pages/CreateProgram";

function Placeholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    </div>
  );
}

function WithLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function AppRouter() {
  return (
    <MainLayout>
    <Routes>
      <Route path="/" element={<Placeholder title="Onboarding Overview" />} />
      <Route path="/programs/new" element={<Placeholder title="Create Program" />} />
      <Route path="/programs/:id/material" element={ <UploadMaterial /> } />
      <Route path="/programs/:id/checklist" element={ <ChecklistBuilder /> } />
      <Route path="/assignments" element={<Placeholder title="Assign Program" />} />
      <Route
        path="/"
        element={
          <WithLayout>
            <OnboardingOverview />
          </WithLayout>
        }
      />

      <Route
        path="/onboarding"
        element={
          <WithLayout>
            <OnboardingOverview />
          </WithLayout>
        }
      />

      <Route
        path="/employees"
        element={
          <WithLayout>
            <Placeholder title="Employees" />
          </WithLayout>
        }
      />

      <Route
        path="/programs/new"
        element={
          <WithLayout>
            <CreateProgram />
          </WithLayout>
        }
      />

      <Route
        path="/programs/:id/material"
        element={
          <WithLayout>
            <Placeholder title="Upload Material" />
          </WithLayout>
        }
      />

      <Route
        path="/programs/:id/checklist"
        element={
          <WithLayout>
            <Placeholder title="Checklist Builder" />
          </WithLayout>
        }
      />

      <Route
        path="/assignments"
        element={
          <WithLayout>
            <Placeholder title="Assign Program" />
          </WithLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </MainLayout>
  );
}