import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import OnboardingOverviewHeader from "../features/onboardingOverview/components/OnboardingOverviewHeader";
import StatCard from "../features/onboardingOverview/components/StatCard";
import StatusPill from "../features/onboardingOverview/components/StatusPill";
import EmptyStateCard from "../features/onboardingOverview/components/EmptyStateCard";

import { useOnboardingOverviewData } from "../features/onboardingOverview/hooks/useOnboardingOverviewData";
import { getUiStatus } from "../features/onboardingOverview/utils/getUiStatus";

function getProgressValues(row) {
  const progress = row?.progress;
  const onboarding = row?.onboarding;

  const completed =
    progress?.completedTasks ??
    progress?.completed ??
    progress?.done ??
    progress?.finished ??
    0;

  const total =
    progress?.totalTasks ??
    progress?.total ??
    onboarding?.checklist?.length ??
    onboarding?.tasks?.length ??
    0;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percentage,
  };
}

export default function OnboardingOverview() {
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  const {
    programs,
    loadingPrograms,
    programError,
    activeOnboardings,
    loadingOnboardings,
    onboardingError,
    stats,
  } = useOnboardingOverviewData();

  const visiblePrograms = showAllPrograms ? programs : programs.slice(0, 4);
  const hasMorePrograms = programs.length > 4;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <OnboardingOverviewHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Program totalt"
          value={stats.programTotal}
          hint="Redo att återanvändas"
        />
        <StatCard
          label="Pågående"
          value={stats.ongoing}
          hint="Aktiva just nu"
        />
        <StatCard
          label="Klara"
          value={stats.done}
          hint="Avslutade flöden"
        />
        <StatCard
          label="Ej startade"
          value={stats.needsAction}
          hint="Väntar på start"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Onboardingprogram</CardTitle>
              <CardDescription>
                Välj ett program för att redigera eller återanvända.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loadingPrograms ? (
                <div className="text-sm text-slate-500">Laddar program…</div>
              ) : programError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {programError}
                </div>
              ) : programs.length > 0 ? (
                <div className="space-y-4">
                  <div className="divide-y divide-slate-200">
                    {visiblePrograms.map((program) => (
                      <Link
                        key={program._id}
                        to={`/programs/${program._id}/material`}
                        className="block"
                      >
                        <div className="w-full flex items-center justify-between py-4 px-2 -mx-2 rounded-md hover:bg-slate-50 transition-colors group">
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 text-sm">
                              {program.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate">
                              {program.description || "Ingen beskrivning"}
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0 ml-3" />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {hasMorePrograms ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAllPrograms((prev) => !prev)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {showAllPrograms
                          ? "Visa färre"
                          : `Visa fler (${programs.length - 4})`}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <EmptyStateCard
                  title="Inga program ännu"
                  description="Skapa ett onboardingprogram för att komma igång."
                  action={
                    <Link to="/programs/new">
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                        <Plus className="h-4 w-4" />
                        Skapa program
                      </button>
                    </Link>
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Aktiva onboardings</CardTitle>
              <CardDescription>
                Pågående onboarding för nyanställda.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {loadingOnboardings ? (
                <div className="text-sm text-slate-500">
                  Laddar onboardings…
                </div>
              ) : onboardingError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {onboardingError}
                </div>
              ) : activeOnboardings.length > 0 ? (
                activeOnboardings.map((row) => {
                  const onboarding = row?.onboarding;
                  const employeeName = onboarding?.employee?.fullName || "—";
                  const jobTitle = onboarding?.employee?.jobTitle || "";
                  const programName = onboarding?.program?.name || "";
                  const uiStatus = getUiStatus(
                    row?.progress,
                    onboarding?.overallStatus
                  );

                  const { completed, total, percentage } =
                    getProgressValues(row);

                  return (
                    <Link
                      key={onboarding?._id}
                      to={`/onboardings/${onboarding?._id}`}
                      className="block"
                    >
                      <div className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors group">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 text-sm">
                            {employeeName}
                          </div>

                          <div className="text-xs text-slate-500 mt-0.5">
                            {[jobTitle, programName].filter(Boolean).join(" • ")}
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>

                            <span className="text-[10px] text-slate-500 whitespace-nowrap">
                              {completed}/{total || 0}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-3 shrink-0">
                          <StatusPill status={uiStatus} />
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <EmptyStateCard
                  title="Inga aktiva onboardings"
                  description="När du tilldelar onboarding syns status här."
                  action={
                    <Link to="/onboarding/assign">
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                        <Plus className="h-4 w-4" />
                        Starta onboarding
                      </button>
                    </Link>
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}