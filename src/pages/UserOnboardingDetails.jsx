import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import {
  fetchMyOnboardingById,
  updateMyOnboardingTask,
} from "../services/meService";

function computeProgress(tasks = []) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Klar").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}

function normalizeOnboardingPayload(res) {
  const src = res?.onboarding ?? res;
  if (!src) return null;

  const tasksRaw = Array.isArray(src.tasks) ? src.tasks : [];
  const tasks = tasksRaw.map((t, idx) => ({
    id: t?.id ?? t?._id ?? String(idx),
    title: t?.title ?? "",
    description: t?.description ?? "",
    status: t?.status ?? "Ej startad",
    items: Array.isArray(t?.items) ? t.items : [],
    comment: t?.comment ?? "",
    order: t?.order ?? idx,
  }));

  const progressRaw = src.progress;
  const progress = progressRaw
    ? {
        total:
          Number(progressRaw.total ?? progressRaw.tasksTotal ?? tasks.length) ||
          tasks.length,
        completed: Number(progressRaw.completed ?? progressRaw.done ?? 0) || 0,
        percent: Number.isFinite(progressRaw.percent)
          ? progressRaw.percent
          : Number(progressRaw.total) || tasks.length
            ? Math.round(
                ((Number(progressRaw.completed ?? progressRaw.done ?? 0) || 0) /
                  (Number(progressRaw.total) || tasks.length)) *
                  100,
              )
            : 0,
      }
    : computeProgress(tasks);

  return {
    id: src.id ?? src._id,
    programName: src.programName ?? src.program?.name ?? "—",
    status: src.status ?? src.overallStatus ?? "Ej startad",
    startDate: src.startDate ?? src.createdAt ?? null,
    progress,
    tasks,
  };
}

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

function getStatusIcon(status) {
  if (status === "Klar") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }

  if (status === "Pågår") {
    return <Clock3 className="h-4 w-4 text-blue-600" />;
  }

  return <Clock3 className="h-4 w-4 text-slate-400" />;
}

function sortTasks(tasks = []) {
  const order = {
    Pågår: 0,
    "Ej startad": 1,
    Klar: 2,
  };

  return [...tasks].sort((a, b) => {
    const statusDiff = (order[a.status] ?? 99) - (order[b.status] ?? 99);
    if (statusDiff !== 0) return statusDiff;

    return a.title.localeCompare(b.title, "sv");
  });
}

function UserTaskCard({ task, onboardingId, onUpdated }) {
  const [status, setStatus] = useState(task.status);
  const [comment, setComment] = useState(task.comment || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus(task.status);
    setComment(task.comment || "");
  }, [task.status, task.comment]);

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      const res = await updateMyOnboardingTask(onboardingId, task.id, {
        status,
        comment,
      });

      onUpdated?.(res);
    } catch (e) {
      setError(e?.message || "Kunde inte spara uppgiften.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">{getStatusIcon(task.status)}</div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {task.title}
                </h3>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPill(
                    task.status,
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              {task.description ? (
                <p className="mt-1 text-sm text-slate-500">
                  {task.description}
                </p>
              ) : null}
            </div>
          </div>

          {Array.isArray(task.items) && task.items.length > 0 ? (
            <div className="mt-4 space-y-2">
              {task.items.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  {item.type === "file" ? (
                    <FileText className="h-4 w-4 text-slate-400" />
                  ) : (
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                  )}

                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">
                Status
              </div>
              <select
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Ej startad">Ej startad</option>
                <option value="Pågår">Pågår</option>
                <option value="Klar">Klar</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-medium text-slate-500 mb-1">
                Kommentar
              </div>
              <textarea
                className="min-h-[90px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Lägg till kommentar..."
              />
            </div>
          </div>

          {error ? (
            <div className="mt-2 text-sm text-red-600">{error}</div>
          ) : null}

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1A4D4F] px-4 text-sm font-medium text-white hover:bg-[#1A4D4F]/90 disabled:opacity-60"
            >
              {saving ? "Sparar..." : "Spara"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserOnboardingDetails() {
  const { id } = useParams();
  const [filter, setFilter] = useState("Alla");

  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetchMyOnboardingById(id);
        if (!alive) return;

        setOnboarding(normalizeOnboardingPayload(res));
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Kunde inte hämta din onboarding.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (id) load();

    return () => {
      alive = false;
    };
  }, [id]);

  function handleUpdated(res) {
    const next = normalizeOnboardingPayload(res);
    if (next) {
      setOnboarding(next);
    }
  }

  const filteredTasks = useMemo(() => {
    const sorted = sortTasks(onboarding?.tasks || []);

    if (filter === "Alla") return sorted;
    return sorted.filter((task) => task.status === filter);
  }, [filter, onboarding?.tasks]);

  const counts = useMemo(() => {
    const tasks = onboarding?.tasks || [];
    return {
      all: tasks.length,
      notStarted: tasks.filter((task) => task.status === "Ej startad").length,
      ongoing: tasks.filter((task) => task.status === "Pågår").length,
      done: tasks.filter((task) => task.status === "Klar").length,
    };
  }, [onboarding?.tasks]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        Laddar onboarding...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!onboarding) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        to="/my/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till dashboard
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {onboarding.programName}
            </h1>
            <p className="text-slate-500 mt-1">
              Här ser du din onboarding, dina uppgifter och hur långt du har
              kommit.
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${getStatusPill(
              onboarding.status,
            )}`}
          >
            {onboarding.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Startdatum
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {formatDate(onboarding.startDate)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Klara uppgifter
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {onboarding.progress.completed}/{onboarding.progress.total}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Progress
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {onboarding.progress.percent}%
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${onboarding.progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Mina uppgifter</CardTitle>
          <CardDescription>
            Här hittar du alla uppgifter som ingår i din onboarding.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("Alla")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Alla"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Alla ({counts.all})
            </button>

            <button
              type="button"
              onClick={() => setFilter("Ej startad")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Ej startad"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Ej startad ({counts.notStarted})
            </button>

            <button
              type="button"
              onClick={() => setFilter("Pågår")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Pågår"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Pågår ({counts.ongoing})
            </button>

            <button
              type="button"
              onClick={() => setFilter("Klar")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Klar"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Klar ({counts.done})
            </button>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <UserTaskCard
                  key={task.id}
                  task={task}
                  onboardingId={onboarding.id}
                  onUpdated={handleUpdated}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-900">
                Inga uppgifter i den här vyn
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Testa att byta filter för att se andra uppgifter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-slate-400">Onboarding-ID: {id}</div>
    </div>
  );
}
