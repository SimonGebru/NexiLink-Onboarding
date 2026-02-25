import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import NexilinkLogo from "../../assets/nexilink-logo.png";

import { getUser, getInitials, logout } from "../../auth/auth";


import NotificationBell from "../../features/notifications/components/NotificationBell";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";

export default function Topbar({ onOpenMobile }) {
  const navigate = useNavigate();

  const user = getUser();
  const initials = getInitials(user?.name);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  
  const {
    items,
    unreadCount,
    loading: notifLoading,
    error: notifError,
    refresh: refreshNotifs,
    markOneRead,
    markAllRead,
  } = useNotifications({ limit: 20, pollMs: 15000 });

  // Stäng user-dropdown om man klickar utanför
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile menu + logo */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onOpenMobile}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>

          {/* Logo + text */}
          <div className="flex items-center gap-3">
            <img src={NexilinkLogo} alt="Nexilink" className="h-6 w-auto" />

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Onboarding
              </span>
              <span className="hidden sm:inline text-xs text-slate-500"></span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          
          <NotificationBell
            unreadCount={unreadCount}
            items={items}
            loading={notifLoading}
            error={notifError}
            onRefresh={refreshNotifs}
            onMarkOneRead={markOneRead}
            onMarkAllRead={markAllRead}
          />

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors"
              aria-label="Open user menu"
            >
              <div className="hidden md:flex flex-col leading-tight text-right">
                <span className="text-sm font-medium text-slate-900">
                  {user?.name || "Användare"}
                </span>
                <span className="text-xs text-slate-500">
                  {user?.role ? user.role : ""}
                </span>
              </div>

              <div className="h-9 w-9 rounded-full bg-[#1A4D4F] text-white flex items-center justify-center text-sm font-semibold ring-2 ring-blue-100">
                {initials}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-200">
                  <div className="text-sm font-medium text-slate-900">
                    {user?.name || "Användare"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {user?.email || ""}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
                >
                  Logga ut
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}