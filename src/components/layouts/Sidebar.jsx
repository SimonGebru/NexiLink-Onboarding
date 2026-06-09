import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  X,
  Settings,
  MessageCircle,
  BookOpen,
} from "lucide-react";

import { getUser } from "../../auth/auth";

// Logo assets
import NexilinkText from "../../assets/Nexilink.png";
import NexilinkIcon from "../../assets/log.png";

const base =
  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";

const getLinkClass = ({ isActive }) =>
  [
    base,
    isActive
      ? "bg-blue-50 text-blue-700 font-medium border border-blue-100"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

function AdminNavItems({ onNavigate }) {
  return (
    <nav className="mt-6 space-y-2">
      <NavLink
        to="/dashboard"
        end
        className={getLinkClass}
        onClick={onNavigate}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <LayoutDashboard className="h-4 w-4" />
        </div>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/onboarding" className={getLinkClass} onClick={onNavigate}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <ClipboardList className="h-4 w-4" />
        </div>
        <span>Onboarding</span>
      </NavLink>

      <NavLink to="/employees" className={getLinkClass} onClick={onNavigate}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <Users className="h-4 w-4" />
        </div>
        <span>Employees</span>
      </NavLink>

      <NavLink to="/admin/Inbox" className={getLinkClass} onClick={onNavigate}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <MessageCircle className="h-4 w-4" />
        </div>
        <span>Meddelanden</span>
      </NavLink>
    </nav>
  );
}

function EmployeeNavItems({ onNavigate }) {
  return (
    <nav className="mt-6 space-y-2">
      <NavLink
        to="/my/dashboard"
        end
        className={getLinkClass}
        onClick={onNavigate}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <LayoutDashboard className="h-4 w-4" />
        </div>
        <span>Min dashboard</span>
      </NavLink>

      <NavLink
        to="/my/onboardings"
        className={getLinkClass}
        onClick={onNavigate}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <ClipboardList className="h-4 w-4" />
        </div>
        <span>Mina onboardings</span>
      </NavLink>

      <NavLink to="/my/Inbox" className={getLinkClass} onClick={onNavigate}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <ClipboardList className="h-4 w-4" />
        </div>
        <span>Meddelanden</span>
      </NavLink>

      <NavLink to="/my/quizzes" className={getLinkClass} onClick={onNavigate}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <BookOpen className="h-4 w-4" />
        </div>
        <span>Quiz</span>
      </NavLink>
    </nav>
  );
}

function SettingsLink({ onNavigate }) {
  return (
    <div className="pt-4">
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          [
            base,
            isActive
              ? "bg-slate-100 text-slate-900 font-medium border border-slate-200"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          ].join(" ")
        }
        onClick={onNavigate}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-200 group-hover:bg-white transition-colors">
          <Settings className="h-4 w-4" />
        </div>
        <span>Inställningar</span>
      </NavLink>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const handleNavigateMobile = () => onCloseMobile?.();

  const user = getUser();
  const role = user?.role;

  const isEmployee = role === "employee";
  const isAdmin = role === "admin";

  function renderNavItems(onNavigate) {
    if (isEmployee) {
      return <EmployeeNavItems onNavigate={onNavigate} />;
    }

    if (isAdmin) {
      return <AdminNavItems onNavigate={onNavigate} />;
    }

    return null;
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 shrink-0 md:flex-col border-r bg-white p-4 self-stretch min-h-0">
        <div className="flex flex-col h-full min-h-0">
          {/* Brand header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <img
              src={NexilinkIcon}
              alt="Nexilink icon"
              className="h-9 w-9 rounded-lg object-contain"
            />

            <div className="leading-tight">
              <img
                src={NexilinkText}
                alt="Nexilink"
                className="h-4 w-auto mb-0.5"
              />
              <div className="text-xs text-slate-500">Onboarding</div>
            </div>
          </div>

          {/* Nav area */}
          <div className="flex-1 overflow-y-auto pr-1 min-h-0">
            {renderNavItems()}
          </div>

          {/* Settings */}
          <div className="mt-auto px-2">
            <SettingsLink />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onCloseMobile}
      />

      {/* Mobile drawer */}
      <aside
        className={[
          "fixed z-50 inset-y-0 left-0 w-80 max-w-[85vw] bg-white border-r border-slate-200 md:hidden",
          "transform transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={NexilinkIcon}
              alt="Nexilink icon"
              className="h-9 w-9 rounded-lg object-contain"
            />

            <div className="leading-tight">
              <img
                src={NexilinkText}
                alt="Nexilink"
                className="h-4 w-auto mb-0.5"
              />
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

        <div className="p-4 h-[calc(100%-3.5rem)] min-h-0 flex flex-col">
          <div className="flex-1 overflow-y-auto min-h-0">
            {renderNavItems(handleNavigateMobile)}
          </div>

          <div className="mt-auto">
            <SettingsLink onNavigate={handleNavigateMobile} />
          </div>
        </div>
      </aside>
    </>
  );
}
