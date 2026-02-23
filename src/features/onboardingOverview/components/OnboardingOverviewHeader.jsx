import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function OnboardingOverviewHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Onboarding – Översikt</h1>
        <p className="text-slate-500 mt-1">
          Skapa program, tilldela till anställda och följ status.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Link to="/programs/new" className="sm:self-start">
          <button
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center gap-2
              rounded-lg
              bg-blue-600
              px-4 py-2
              text-sm font-medium text-white
              shadow-sm
              hover:bg-blue-700
              transition
            "
          >
            <span className="text-base leading-none">+</span>
            Skapa nytt program
          </button>
        </Link>

        <Link to="/onboarding/assign" className="sm:self-start">
          <button
            className="
              w-full sm:w-auto
              inline-flex items-center justify-center gap-2
              rounded-lg
              border border-slate-200 bg-white
              px-4 py-2
              text-sm font-medium text-slate-700
              hover:bg-slate-50
              transition
            "
          >
            <Plus className="h-4 w-4" />
            Tilldela onboarding
          </button>
        </Link>
      </div>
    </div>
  );
}