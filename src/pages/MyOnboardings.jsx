import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import { useUserDashboardData } from "../features/userDashboard/hooks/useUserDashboardData";

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("sv-SE").format(date);
}

function getStatusPill(status) {
  if (status === "Klar") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Pågår") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-slate-100 text-slate-600";
}

function UserOnboardingCard({ onboarding }) {
  const progress = onboarding?.progress || {};
  const percent = Math.max(0, Math.min(100, progress.percent || 0));
  const completed = progress.completed ?? 0;
  const total = progress.total ?? 0;

  return (
    <Link
      to={
        onboarding?.id ? `/my/onboarding/${onboarding.id}` : "/my/onboardings"
      }
      className="block"
      aria-disabled={!onboarding?.id}
      onClick={(e) => {
        if (!onboarding?.id) e.preventDefault();
      }}
    >
      <div className="group rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 truncate">
                {onboarding.programName}
              </h3>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPill(
                  onboarding.status,
                )}`}
              >
                {onboarding.status}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Startdatum: {formatDate(onboarding.startDate)}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="shrink-0 text-xs text-slate-500">
                {completed}/{total}
              </span>
            </div>
          </div>

          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export default function UserDashboard() {
  const [showAll, setShowAll] = useState(false);

  const { onboardings, loading, error, stats } = useUserDashboardData();

  const visibleOnboardings = showAll ? onboardings : onboardings.slice(0, 4);
  const hasMore = onboardings.length > 4;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Mina onboardingprogram
          </h1>
          <p className="text-slate-500 mt-1">
            Här ser du dina aktiva, kommande och avslutade onboardings.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Totalt
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.total}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Alla onboardingprogram
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Pågående
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.ongoing}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Du arbetar aktivt med dessa
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Ej startade
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.notStarted}
          </div>
          <div className="mt-1 text-sm text-slate-500">Redo att påbörjas</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Klara
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.done}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Slutförda onboardings
          </div>
        </div>
      </div>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Mina onboardings</CardTitle>
          <CardDescription>
            Klicka på en onboarding för att se detaljer och följa dina
            uppgifter.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-sm text-slate-500">
              Laddar dina onboardings…
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : visibleOnboardings.length > 0 ? (
            <div className="space-y-3">
              {visibleOnboardings.map((onboarding) => (
                <UserOnboardingCard
                  key={onboarding.id}
                  onboarding={onboarding}
                />
              ))}

              {hasMore ? (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAll((prev) => !prev)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {showAll
                      ? "Visa färre"
                      : `Visa fler (${onboardings.length - 4})`}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-900">
                Inga onboardings ännu
              </div>
              <p className="mt-1 text-sm text-slate-600">
                När du blir tilldelad en onboarding kommer den att visas här.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
