import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Link to="/programs/new">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" />
              Skapa nytt program
            </button>
          </Link>

          <Link to="/onboarding">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              <Plus className="h-4 w-4" />
              Ladda upp material
            </button>
          </Link>

          <Link to="/onboarding/assign">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              <Plus className="h-4 w-4" />
              Tilldela onboarding
            </button>
          </Link>
        </div>
      </div>

      <p className="text-slate-500">
        Snabb översikt av program, status och vad som behöver göras.
      </p>
    </div>
  );
}