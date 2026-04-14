import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function OnboardingOverviewHeader() {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Onboarding – Översikt
        </h1>
        <p className="text-slate-500 mt-1">
          Skapa program, tilldela till anställda och följ status.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link to="/programs/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" />
            Skapa nytt program
          </button>
        </Link>

        <Link to="/onboarding/assign">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            Starta onboarding för anställd
          </button>
        </Link>
      </div>
    </div>
  );
}