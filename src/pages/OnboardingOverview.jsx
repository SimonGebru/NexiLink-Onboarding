import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";

import OnboardingOverviewHeader from "../features/onboardingOverview/components/OnboardingOverviewHeader";
import StatCard from "../features/onboardingOverview/components/StatCard";
import ListRow from "../features/onboardingOverview/components/ListRow";
import StatusPill from "../features/onboardingOverview/components/StatusPill";
import EmptyStateCard from "../features/onboardingOverview/components/EmptyStateCard";

import { useOnboardingOverviewData } from "../features/onboardingOverview/hooks/useOnboardingOverviewData";
import { getUiStatus } from "../features/onboardingOverview/utils/getUiStatus";

export default function OnboardingOverview() {
  const {
    programs,
    loadingPrograms,
    programError,

    activeOnboardings,
    loadingOnboardings,
    onboardingError,

    stats,
  } = useOnboardingOverviewData();

  return (
    <div className="space-y-6">
      <OnboardingOverviewHeader />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Program totalt" value={stats.programTotal} hint="Redo att återanvändas" />
        <StatCard label="Pågående onboardings" value={stats.ongoing} hint="Aktiva just nu" />
        <StatCard label="Klara" value={stats.done} hint="Avslutade flöden" />
        <StatCard label="Behöver åtgärd" value={stats.needsAction} hint="Ej startade onboardings" />
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Programs */}
        <Card>
          <CardHeader>
            <CardTitle>Onboardingprogram</CardTitle>
            <CardDescription>
              Välj ett program för att redigera eller återanvända.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {loadingPrograms ? (
              <div className="text-sm text-slate-500">Laddar program…</div>
            ) : programError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {programError}
              </div>
            ) : programs.length > 0 ? (
              programs.map((p) => (
                <Link key={p._id} to={`/programs/${p._id}/material`}>
                  <ListRow title={p.name} subtitle={p.description} right={null} />
                </Link>
              ))
            ) : (
              <EmptyStateCard
                title="Inga program ännu"
                description="Skapa ett onboardingprogram för att komma igång."
                action={
                  <Link to="/programs/new">
                    <button
                      className="
                        inline-flex items-center justify-center gap-2
                        rounded-lg bg-blue-600 px-4 py-2
                        text-sm font-medium text-white
                        hover:bg-blue-700 transition
                      "
                    >
                      <span className="text-base leading-none">+</span>
                      Skapa program
                    </button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Active onboardings */}
        <Card>
          <CardHeader>
            <CardTitle>Aktiva onboardings</CardTitle>
            <CardDescription>Pågående onboarding för nyanställda.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {loadingOnboardings ? (
              <div className="text-sm text-slate-500">Laddar onboardings…</div>
            ) : onboardingError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {onboardingError}
              </div>
            ) : activeOnboardings.length > 0 ? (
              activeOnboardings.map((row) => {
                const o = row?.onboarding;
                const progress = row?.progress;

                const employeeName = o?.employee?.fullName || "—";
                const jobTitle = o?.employee?.jobTitle || "";
                const programName = o?.program?.name || "";
                const uiStatus = getUiStatus(progress, o?.overallStatus);

                const subtitle = [jobTitle, programName].filter(Boolean).join(" • ");

                return (
                  <Link key={o?._id} to={`/onboardings/${o?._id}`}>
                    <ListRow
                      title={employeeName}
                      subtitle={subtitle}
                      right={<StatusPill status={uiStatus} />}
                    />
                  </Link>
                );
              })
            ) : (
              <EmptyStateCard
                title="Inga aktiva onboardings"
                description="När du tilldelar onboarding syns status här."
                action={
                  <Link to="/onboarding/assign">
                    <button
                      className="
                        inline-flex items-center justify-center gap-2
                        rounded-lg border border-slate-200 bg-white px-4 py-2
                        text-sm font-medium text-slate-700
                        hover:bg-slate-50 transition
                      "
                    >
                      <Plus className="h-4 w-4" />
                      Tilldela onboarding
                    </button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}