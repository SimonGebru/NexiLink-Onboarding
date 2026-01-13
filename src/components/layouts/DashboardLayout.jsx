import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar (desktop + mobile drawer) */}
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={closeMobile} />

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobile={openMobile} />
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}