import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import ProgressBar from "../features/assignOnboarding/components/ProgressBar";
import StatusPill from "../features/assignOnboarding/components/StatusPill";

import { getUser } from "../auth/auth";
import { useUserDashboardData } from "../features/userDashboard/hooks/useUserDashboardData";
import { fetchMyOnboardingById } from "../services/meService";

function getNextTasks(tasks = []) {
  const order = {
    Pågår: 0,
    "Ej startad": 1,
    Klar: 2,
  };

  return tasks
    .filter((t) => t.status !== "Klar")
    .slice()
    .sort((a, b) => {
      const diff = (order[a.status] ?? 99) - (order[b.status] ?? 99);
      if (diff !== 0) return diff;
      return (a.title || "").localeCompare(b.title || "", "sv");
    })
    .slice(0, 3)
    .map((t) => ({ id: t.id, title: t.title, status: t.status }));
}

export default function UserDashboard() {
  const user = getUser();
  const { onboardings, loading, error } = useUserDashboardData();

  const activeOnboarding = useMemo(() => {
    const ongoing = onboardings.find((o) => o.status === "Pågår");
    return ongoing || onboardings[0] || null;
  }, [onboardings]);

  const [nextTasks, setNextTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadTasks() {
      if (!activeOnboarding?.id) {
        if (alive) setNextTasks([]);
        return;
      }

      try {
        setTasksLoading(true);
        const res = await fetchMyOnboardingById(activeOnboarding.id);
        const onboarding = res?.onboarding ?? res;
        const tasks = Array.isArray(onboarding?.tasks) ? onboarding.tasks : [];
        const normalized = tasks.map((t, idx) => ({
          id: t?.id ?? t?._id ?? String(idx),
          title: t?.title ?? "",
          status: t?.status ?? "Ej startad",
        }));

        if (!alive) return;
        setNextTasks(getNextTasks(normalized));
      } catch {
        if (!alive) return;
        setNextTasks([]);
      } finally {
        if (!alive) return;
        setTasksLoading(false);
      }
    }

    loadTasks();
    return () => {
      alive = false;
    };
  }, [activeOnboarding?.id]);

  const activeProgressPercent = activeOnboarding?.progress?.percent ?? 0;
  const activeCompleted = activeOnboarding?.progress?.completed ?? 0;
  const activeTotal = activeOnboarding?.progress?.total ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Hej {user?.name || ""}
        </h1>
        <p className="text-slate-500">
          Här ser du vad du ska fokusera på i din onboarding.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT (main content) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Aktiv onboarding */}
          <Card>
            <CardHeader>
              <CardTitle>Fortsätt där du slutade</CardTitle>
              <CardDescription>Din aktiva onboarding</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-slate-500">Laddar…</div>
              ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : activeOnboarding ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-slate-900">
                      {activeOnboarding.programName}
                    </div>
                    <StatusPill status={activeOnboarding.status} />
                  </div>

                  <div className="text-sm text-slate-500">
                    {activeCompleted} / {activeTotal} uppgifter klara
                  </div>

                  <ProgressBar value={activeProgressPercent} />

                  <Link
                    to={`/my/onboarding/${activeOnboarding.id}`}
                    className="inline-block text-sm font-medium text-[#1A4D4F] hover:underline"
                  >
                    Fortsätt onboarding →
                  </Link>
                </>
              ) : (
                <div className="text-sm text-slate-500">
                  Du har ingen onboarding ännu.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nästa uppgifter */}
          <Card>
            <CardHeader>
              <CardTitle>Nästa uppgifter</CardTitle>
              <CardDescription>Detta bör du göra härnäst</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {tasksLoading ? (
                <div className="text-sm text-slate-500">Laddar…</div>
              ) : nextTasks.length > 0 ? (
                nextTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50 transition"
                  >
                    <div className="text-sm text-slate-900">{task.title}</div>
                    <StatusPill status={task.status} />
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">
                  Inga uppgifter att visa.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT (side content) */}
        <div className="space-y-6">
          {/* Progress card */}
          <Card>
            <CardHeader>
              <CardTitle>Din progress</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">
                  Uppgifter klara
                </div>
                <ProgressBar value={activeProgressPercent} />
              </div>

              <div className="text-sm text-slate-500">
                {activeCompleted} av {activeTotal} uppgifter klara
              </div>
            </CardContent>
          </Card>

          {/* Snabbt */}
          <Card>
            <CardHeader>
              <CardTitle>Snabbt</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Link
                to="/my/onboardings"
                className="block text-sm text-[#1A4D4F] hover:underline"
              >
                Se alla mina onboardings
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
