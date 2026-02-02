import { Link } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { apiRequest } from "../services/api.js";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      {hint ? <div className="mt-1 text-sm text-slate-500">{hint}</div> : null}
    </div>
  );
}

function ListItem({ title, subtitle, right }) {
  return (
    <div className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 hover:border-slate-300 transition-colors">
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

function Donut({ value = 0, label }) {
  const safe = Math.max(0, Math.min(100, value));
  const deg = safe * 3.6;

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-14 w-14 rounded-full"
        style={{
          background: `conic-gradient(#1A4D4F ${deg}deg, #E2E8F0 0deg)`,
        }}
      >
        <div className="absolute inset-[6px] rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-semibold text-slate-900">{safe}%</span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">
          {label}
        </div>
      </div>
    </div>
  );
}

function MiniBarChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-slate-900">Aktivitet</div>
        <div className="text-xs text-slate-400">Senaste 7 dagar</div>
      </div>

      <div className="relative rounded-lg border border-slate-200 bg-slate-50 px-3 pt-3 pb-2">
        <div className="absolute inset-x-3 top-3 bottom-7 pointer-events-none">
          <div className="h-full flex flex-col justify-between">
            <div className="h-px bg-slate-200/70" />
            <div className="h-px bg-slate-200/60" />
            <div className="h-px bg-slate-200/50" />
          </div>
        </div>

        {/* Bars */}
        <div className="relative h-24 flex items-end justify-between gap-3 pt-2">
          {data.map((d) => {
            const h = Math.max(6, Math.round((d.value / max) * 96));
            return (
              <div key={d.label} className="flex flex-col items-center flex-1">
                <div className="w-full flex items-end justify-center h-24">
                  <div
                    className="w-[14px] rounded-t-md bg-[#1A4D4F]/90 shadow-sm"
                    style={{ height: `${h}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X labels */}
        <div className="mt-2 flex items-center justify-between px-1">
          {data.map((d) => (
            <div
              key={`${d.label}-x`}
              className="flex-1 text-center text-[11px] text-slate-400"
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Visuell placeholder – kopplas till riktig statistik senare.
      </p>
    </div>
  );
}

function getUiStatus(progress, overallStatus) {
  if (overallStatus === "paused") return "Pausad";
  if ((progress?.percent || 0) >= 100) return "Klar";
  if ((progress?.done || 0) > 0) return "Pågår";
  return "Ej startad";
}

export default function DashboardHome() {
  const [activeOnboardings, setActiveOnboardings] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [onboardingsData, programsData] = await Promise.all([
          apiRequest("/api/onboardings?status=active", { method: "GET" }),
          apiRequest("/api/programs", { method: "GET" }),
        ]);

        const formatted = (
          Array.isArray(onboardingsData) ? onboardingsData : []
        )
          .map((row) => {
            const o = row?.onboarding;
            const progress = row?.progress;
            return {
              id: o?._id,
              name: o?.employee?.fullName || "",
              role: o?.employee?.jobTitle || "",
              status: getUiStatus(progress, o?.overallStatus),
            };
          })
          .filter((item) => item.name);

        setActiveOnboardings(formatted);
        setPrograms(Array.isArray(programsData) ? programsData : []);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const programsTotal = programs.length;
  const ongoingTotal = activeOnboardings.filter(
    (a) => a.status === "Pågår",
  ).length;
  const doneTotal = activeOnboardings.filter((a) => a.status === "Klar").length;
  const needsActionTotal = activeOnboardings.filter(
    (a) => a.status === "Ej startad",
  ).length;

  const activityFeed = [
    {
      id: "e1",
      title: "Ny onboarding startad",
      subtitle: "Kalle Persson • Intro för nyanställd",
      time: "Idag",
    },
    {
      id: "e2",
      title: "Material uppladdat",
      subtitle: "IT policy.pdf • Senior konsult onboarding",
      time: "Igår",
    },
    {
      id: "e3",
      title: "Onboarding klar",
      subtitle: "Maria Lundgren • Verktyg & rutiner",
      time: "3 dagar sedan",
    },
  ];

  const upcoming = [
    {
      id: "u1",
      title: "Intro för nyanställd",
      subtitle: "Kalle Persson",
      when: "Idag",
    },
    {
      id: "u2",
      title: "Systemåtkomster & IT-Setup",
      subtitle: "Lena Karlsson",
      when: "Imorgon",
    },
    {
      id: "u3",
      title: "Genomgång av onboarding-plan",
      subtitle: "Erik Svensson",
      when: "Onsdag",
    },
    {
      id: "u4",
      title: "Uppföljningsmöte",
      subtitle: "Maria Lundgren",
      when: "Fredag",
    },
  ];

  const todos = [
    {
      id: "t1",
      title: "Tilldela mentor",
      subtitle: "Lena Karlsson",
      status: "Ej startad",
    },
    {
      id: "t2",
      title: "Följ upp status",
      subtitle: "Kalle Persson",
      status: "Pågår",
    },
    {
      id: "t3",
      title: "Skapa konto & behörigheter",
      subtitle: "Erik Svensson",
      status: "Ej startad",
    },
    {
      id: "t4",
      title: "Boka intro-möte",
      subtitle: "Maria Lundgren",
      status: "Pågår",
    },
  ];

  // Goals (mock)
  const goalsWeek = 75;
  const goalsMonth = 40;

  const activity7d = [
    { label: "M", value: 3 },
    { label: "T", value: 5 },
    { label: "O", value: 4 },
    { label: "T", value: 7 },
    { label: "F", value: 6 },
    { label: "L", value: 2 },
    { label: "S", value: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header*/}
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Program totalt"
          value={programsTotal}
          hint="Redo att återanvändas"
        />
        <StatCard
          label="Pågående onboardings"
          value={ongoingTotal}
          hint="Aktiva just nu"
        />
        <StatCard label="Klara" value={doneTotal} hint="Avslutade flöden" />
        <StatCard
          label="Behöver åtgärd"
          value={needsActionTotal}
          hint="Ej startade onboardings"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <Card className="lg:col-start-1 lg:row-start-1">
          <CardHeader>
            <CardTitle>Ny aktivitet</CardTitle>
            <CardDescription>Senaste händelserna i systemet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityFeed.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {e.title}
                    </div>
                    <div className="text-sm text-slate-500">{e.subtitle}</div>
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap">
                    {e.time}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-start-2 lg:row-start-1">
          <CardHeader>
            <CardTitle>Aktiva onboardings</CardTitle>
            <CardDescription>Snabbstatus per nyanställd.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-sm text-slate-500">Laddar...</div>
            ) : activeOnboardings.length > 0 ? (
              activeOnboardings.map((a) => (
                <Link key={a.id} to={`/onboardings/${a.id}`}>
                  <ListItem
                    title={a.name}
                    subtitle={a.role}
                    right={<StatusPill status={a.status} />}
                  />
                </Link>
              ))
            ) : (
              <div className="text-sm text-slate-500">
                Inga aktiva onboardings
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-start-3 lg:row-start-1">
          <CardHeader>
            <CardTitle>Kommande</CardTitle>
            <CardDescription>Det som händer snart.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((u) => (
              <div
                key={u.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {u.title}
                    </div>
                    <div className="text-sm text-slate-500">{u.subtitle}</div>
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap">
                    {u.when}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="lg:col-start-1 lg:col-span-2 lg:row-start-2">
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>Progress & aktivitet (mock).</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <Donut value={goalsWeek} label="För veckan" />
                <div className="mt-2 text-sm text-slate-500">
                  Välj onboarding
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <Donut value={goalsMonth} label="För månaden" />
                <div className="mt-2 text-sm text-slate-500">
                  Avsluta onboardings
                </div>
              </div>
            </div>

            <MiniBarChart data={activity7d} />
          </CardContent>
        </Card>

        {/* Todo*/}
        <Card className="lg:col-start-3 lg:row-start-2">
          <CardHeader>
            <CardTitle>Todo</CardTitle>
            <CardDescription>Snabba åtgärder för HR/chef.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todos.map((t) => (
              <Link key={t.id} to="/onboarding/assign">
                <ListItem
                  title={t.title}
                  subtitle={t.subtitle}
                  right={<StatusPill status={t.status} />}
                />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
