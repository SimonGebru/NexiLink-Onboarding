import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="flex h-full">
        {/* Sidebar (desktop + mobile hanteras i Sidebar.jsx) */}
        <Sidebar />

        
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <Topbar />

          {/* Content area */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}