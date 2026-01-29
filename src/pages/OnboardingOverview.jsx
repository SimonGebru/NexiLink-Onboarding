import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Button from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { ChevronRight, Plus } from "lucide-react";

import { apiRequest } from "../services/api";

// MOCK tills onboarding-API är klart
const activeOnboardings = [
  { id: "a1", name: "Erik Svensson", role: "Säljare", status: "Pågår" },
  { id: "a2", name: "Lena Karlsson", role: "Utvecklare", status: "Ej startad" },
  { id: "a3", name: "Maria Lundgren", role: "Marknadsförare", status: "Klar" },
  { id: "a4", name: "Kalle Persson", role: "Projektledare", status: "Pågår" },
];

function StatusPill({ status }) {
  const map = {
    Pågår: "bg-blue-50 text-blue-700 border-blue-200",
    "Ej startad": "bg-slate-50 text-slate-700 border-slate-200",
    Klar: "bg-green-50 text-green-700 border-green-200",
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
        {subtitle ? <div className="text-sm text-slate-500">{subtitle}</div> : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}

export default function OnboardingOverview() {
  // Programs från backend
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programError, setProgramError] = useState("");

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

        // Din backend kastar 404 "No programs found" om listan är tom.
        // Vi vill tolka det som "tom lista", inte visa error.
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

  // Stats: programTotal baseras på backend-data
  const programTotal = programs.length;

  // Stats: onboardings är fortfarande mock
  const ongoingTotal = useMemo(
    () => activeOnboardings.filter((a) => a.status === "Pågår").length,
    []
  );
  const doneTotal = useMemo(
    () => activeOnboardings.filter((a) => a.status === "Klar").length,
    []
  );
  const needsActionTotal = useMemo(
    () => activeOnboardings.filter((a) => a.status === "Ej startad").length,
    []
  );

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
          <div className="mt-2 text-2xl font-bold text-slate-900">{ongoingTotal}</div>
          <div className="mt-1 text-sm text-slate-500">Aktiva just nu</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Klara</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{doneTotal}</div>
          <div className="mt-1 text-sm text-slate-500">Avslutade flöden</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Behöver åtgärd</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{needsActionTotal}</div>
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

        {/* Active onboardings (mock) */}
        <Card>
          <CardHeader>
            <CardTitle>Aktiva onboardings</CardTitle>
            <CardDescription>Pågående onboarding för nyanställda.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {activeOnboardings.length > 0 ? (
              activeOnboardings.map((a) => (
                <Link key={a.id} to="/assignments">
                  <ListRow
                    title={a.name}
                    subtitle={a.role}
                    right={<StatusPill status={a.status} />}
                  />
                </Link>
              ))
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