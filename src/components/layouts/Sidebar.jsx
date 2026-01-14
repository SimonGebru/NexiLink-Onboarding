import { NavLink } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Users, X } from "lucide-react";

const base =
  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";

const getLinkClass = ({ isActive }) =>
  [
    base,
    isActive
      ? "bg-blue-50 text-blue-700 font-medium border border-blue-100"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

function NavItems({ onNavigate }) {
  return (
    <nav className="mt-6 space-y-2">
      <NavLink
        to="/"
        end
        className={getLinkClass}
        onClick={onNavigate}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <LayoutDashboard className="h-4 w-4" />
        </div>
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/onboarding"
        className={getLinkClass}
        onClick={onNavigate}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <ClipboardList className="h-4 w-4" />
        </div>
        <span>Onboarding</span>
      </NavLink>

      <NavLink
        to="/employees"
        className={getLinkClass}
        onClick={onNavigate}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <Users className="h-4 w-4" />
        </div>
        <span>Employees</span>
      </NavLink>
    </nav>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  // När man klickar på en länk i mobilmenyn vill vi stänga menyn direkt
  const handleNavigateMobile = () => onCloseMobile?.();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white p-4 h-full">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            N
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-slate-900">Nexilink</div>
            <div className="text-xs text-slate-500">Onboarding</div>
          </div>
        </div>

        <NavItems />

        <div className="mt-auto pt-6 px-2">
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} Nexilink
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onCloseMobile}
      />

      {/*  Mobile drawer */}
      <aside
        className={[
          "fixed z-50 inset-y-0 left-0 w-80 max-w-[85vw] bg-white border-r border-slate-200 md:hidden",
          "transform transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Mobile header */}
        <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              N
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">Nexilink</div>
              <div className="text-xs text-slate-500">Onboarding</div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="p-4">
          <NavItems onNavigate={handleNavigateMobile} />

          <div className="mt-8 text-xs text-slate-400 px-2">
            © {new Date().getFullYear()} Nexilink
          </div>
        </div>
      </aside>
    </>
  );
}