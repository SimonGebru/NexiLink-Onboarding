import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Rad 1: Sidebar + Main (ska ta all plats ovanför footern) */}
      <div className="flex flex-1 min-h-0">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={closeMobile} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobile={openMobile} />

          {/* Scroll ska ske här i content-ytan */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Rad 2: Footer (under både sidebar och content) */}
      <Footer />
    </div>
  );
}