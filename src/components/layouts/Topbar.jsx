import { Bell, Menu } from "lucide-react";
import NexilinkLogo from "../../assets/nexilink-logo.png";

export default function Topbar({ onOpenMobile }) {
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
            <img
              src={NexilinkLogo}
              alt="Nexilink"
              className="h-6 w-auto"
            />

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Onboarding
              </span>
              <span className="hidden sm:inline text-xs text-slate-500">
               
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col leading-tight text-right">
              <span className="text-sm font-medium text-slate-900">
                Simon
              </span>
              <span className="text-xs text-slate-500">
              </span>
            </div>

            <div className="h-9 w-9 rounded-full bg-[#1A4D4F] text-white flex items-center justify-center text-sm font-semibold ring-2 ring-blue-100">
              S
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}