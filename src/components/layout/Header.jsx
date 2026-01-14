import { Bell, Briefcase, UserPen } from "lucide-react";

export default function Header() {
  return (
    <div className="w-full flex items-center justify-between">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-gray-100 rounded-md">
          <Briefcase size={20} className="text-gray-700" />
        </div>
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
          Nexilink Onboarding
        </h1>
      </div>

      {/* Buttons i nav */}
      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={20} />
        </button>
        <button>
          <UserPen
            size={20}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          />
        </button>
      </div>
    </div>
  );
}
