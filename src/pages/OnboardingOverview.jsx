import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { ChevronRight, Plus } from "lucide-react";

import { apiRequest } from "../services/api";

function StatusPill({ status }) {
  const map = {
    Pågår: "bg-blue-50 text-blue-700 border-blue-200",
    "Ej startad": "bg-slate-50 text-slate-700 border-slate-200",
    Klar: "bg-green-50 text-green-700 border-green-200",
    Pausad: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        map[status] || map["Ej startad"],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function ListRow({ title, subtitle, right }) {
  return (
    <div
      className="
        group
        flex items-center justify-between
        rounded-lg border border-slate-200 bg-white
        px-4 py-3
        hover:bg-slate-50
        hover:border-slate-300
        transition-colors
      "
    >
      <div className="min-w-0">
        <div className="font-medium text-slate-900">{title}</div>
        {subtitle ? (
          <div className="text-sm text-slate-500">{subtitle}</div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}

// Gör en “UI-status” som matchar dina pills: Ej startad / Pågår / Klar
function getUiStatus(progress, overallStatus) {
  if (overallStatus === "paused") return "Pausad";
  if ((progress?.percent || 0) >= 100) return "Klar";
  if ((progress?.done || 0) > 0) return "Pågår";
  return "Ej startad";
}

export default function OnboardingOverview() {
  // Programs från backend
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programError, setProgramError] = useState("");

  // Onboardings från backend (NYTT)
  // Backend returnerar: [{ onboarding, progress }, ...]
  const [activeOnboardings, setActiveOnboardings] = useState([]);
  const [loadingOnboardings, setLoadingOnboardings] = useState(true);
  const [onboardingError, setOnboardingError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadPrograms() {
      try {
        setLoadingPrograms(true);
        setProgramError("");

        const data = await apiRequest("/api/programs", { method: "GET" });

        if (!alive) return;
        setPrograms(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;

        const msg = err?.message || "";
        if (msg.toLowerCase().includes("no programs found")) {
          setPrograms([]);
          setProgramError("");
        } else {
          setProgramError(msg || "Kunde inte hämta program.");
        }
      } finally {
        if (!alive) return;
        setLoadingPrograms(false);
      }
    }

    loadPrograms();
    return () => {
      alive = false;
    };
  }, []);

  // NYTT: hämta onboardings från backend
  useEffect(() => {
    let alive = true;

    async function loadOnboardings() {
      try {
        setLoadingOnboardings(true);
        setOnboardingError("");

        // status=active är default i din controller, men vi kan vara tydliga
        const data = await apiRequest("/api/onboardings?status=active", {
          method: "GET",
        });

        if (!alive) return;
        setActiveOnboardings(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;
        setOnboardingError(err?.message || "Kunde inte hämta onboardings.");
      } finally {
        if (!alive) return;
        setLoadingOnboardings(false);
      }
    }

    loadOnboardings();
    return () => {
      alive = false;
    };
  }, []);

  // Stats
  const programTotal = programs.length;

  const onboardingStats = useMemo(() => {
    const rows = activeOnboardings || [];

    let ongoing = 0;
    let done = 0;
    let needsAction = 0;

    for (const row of rows) {
      const uiStatus = getUiStatus(row?.progress, row?.onboarding?.overallStatus);
      if (uiStatus === "Klar") done++;
      else if (uiStatus === "Pågår") ongoing++;
      else needsAction++;
    }

    return { ongoing, done, needsAction };
  }, [activeOnboardings]);

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Program totalt</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{programTotal}</div>
          <div className="mt-1 text-sm text-slate-500">Redo att återanvändas</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Pågående onboardings</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {onboardingStats.ongoing}
          </div>
          <div className="mt-1 text-sm text-slate-500">Aktiva just nu</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Klara</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {onboardingStats.done}
          </div>
          <div className="mt-1 text-sm text-slate-500">Avslutade flöden</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Behöver åtgärd</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {onboardingStats.needsAction}
          </div>
          <div className="mt-1 text-sm text-slate-500">Ej startade onboardings</div>
        </div>
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
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold text-slate-900">Inga program ännu</div>
                <p className="mt-1 text-sm text-slate-600">
                  Skapa ett onboardingprogram för att komma igång.
                </p>
                <div className="mt-4">
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active onboardings (BACKEND) */}
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
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold text-slate-900">
                  Inga aktiva onboardings
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  När du tilldelar onboarding syns status här.
                </p>
                <div className="mt-4">
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}