import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import UploadMaterial from "../pages/UploadMaterial.jsx";
import ChecklistBuilder from "../pages/ChecklistBuilder.jsx";

function Placeholder({ title }) {
  return (
    <div className="min-h-screen grid place-items-center bg-black">
  <h1 className="text-white text-5xl font-black rotate-2">
    {title}
  </h1>
</div>
  );
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </MainLayout>
  );
}