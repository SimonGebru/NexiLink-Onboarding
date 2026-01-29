import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  // Här väljer vi vilka sidor som INTE ska scrolla i main
  const lockMainScroll = pathname === "/onboarding/assign";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Rad 1: Sidebar + Main */}
      <div className="flex flex-1 min-h-0">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={closeMobile} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobile={openMobile} />

          <main
            className={[
              "flex-1 min-h-0",
              lockMainScroll ? "overflow-hidden" : "overflow-y-auto",
            ].join(" ")}
          >
            <div
              className={[
                "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6",
                lockMainScroll ? "h-full min-h-0 flex flex-col" : "",
              ].join(" ")}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Rad 2: Footer */}
      <Footer />
    </div>
  );
}