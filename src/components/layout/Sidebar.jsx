import { NavLink } from "react-router-dom";
import {
  Briefcase,
  Users,
  LayoutDashboard,
  Settings,
  Menu,
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", path: "/", Icon: LayoutDashboard },
    { name: "Onboarding", path: "/programs/:id/material", Icon: Briefcase },
    { name: "Employees", path: "/programs/:id/checklist", Icon: Users },
  ];

  return (
    <div className="h-full flex flex-col bg-white py-4">
      {/* Meny */}
      <div className="px-8 mb-8">
        <button className="text-gray-500 hover:text-gray-900 transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* Aktiva pathen */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors
                ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
            }
          >
            <item.Icon size={20} strokeWidth={1.5} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Inställningar */}
      <div className="px-4 mt-auto">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Settings size={20} strokeWidth={1.5} />
          Inställningar
        </NavLink>
      </div>
    </div>
  );
}
