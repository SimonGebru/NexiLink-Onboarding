import { Routes, Route, Navigate } from "react-router-dom";

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
    <WithLayout>
    <Routes>

      <Route
        path="/"
        element={
          
            <OnboardingOverview />
          
        }
      />
      <Route
        path="/onboarding"
        element={
          
            <OnboardingOverview />
          
        }
      />

      <Route
        path="/employees"
        element={
          
            <Placeholder title="Employees" />
          
        }
      />

      <Route
        path="/programs/new"
        element={
          
            <CreateProgram />
          
        }
      />

      <Route
        path="/programs/:id/material"
        element={ 
        
          <UploadMaterial />
         }
      />

      <Route
        path="/programs/:id/checklist"
        element={ 
        
          <ChecklistBuilder />
        
        }
      />

      <Route
        path="/assignments"
        element={
          
            <Placeholder title="Assign Program" />
          
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </WithLayout>
  );
}