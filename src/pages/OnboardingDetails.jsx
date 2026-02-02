import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Link as LinkIcon } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import { Textarea, Select } from "../components/ui/Form";
import Button from "../components/ui/Button";

import {
  fetchOnboardingById,
  updateOnboardingTask,
} from "../services/onboardingService";

function ProgressBar({ value = 0 }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-900">
          Procent klar: {safe}%
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-[#1A4D4F]" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Klar: "bg-green-50 text-green-700 border border-green-200",
    Pågår: "bg-blue-50 text-blue-700 border border-blue-200",
    "Ej startad": "bg-slate-50 text-slate-700 border border-slate-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border",
        map[status] || map["Ej startad"],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function TaskRow({ task, onboardingId, onPatched }) {
  const [status, setStatus] = useState(task.status || "Ej startad");
  const [comment, setComment] = useState(task.comment || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setStatus(task.status || "Ej startad");
    setComment(task.comment || "");
  }, [task.status, task.comment]);

  async function handleSave() {
    try {
      setSaving(true);
      setErr("");

      const res = await updateOnboardingTask(onboardingId, task._id, {
        status,
        comment,
      });

      // res = { onboarding, progress }
      onPatched(res);
    } catch (e) {
      setErr(e?.message || "Kunde inte spara uppgiften.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{task.title}</div>

          {task.items?.length ? (
            <div className="mt-2 space-y-1">
              {task.items.map((it, idx) => (
                <div
                  key={`${it.label}-${idx}`}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  {it.type === "file" ? (
                    <FileText className="h-4 w-4 text-slate-400" />
                  ) : (
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="truncate">{it.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <StatusPill status={status} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">Status</div>
          <Select
            className="h-11"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Ej startad">Ej startad</option>
            <option value="Pågår">Pågår</option>
            <option value="Klar">Klar</option>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <div className="text-xs font-medium text-slate-500 mb-1">Kommentar</div>
          <Textarea
            className="min-h-[90px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Lägg till kommentar..."
          />
        </div>
      </div>

      {err ? <div className="text-sm text-red-600">{err}</div> : null}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-4 bg-[#1A4D4F] hover:bg-[#1A4D4F]/90"
        >
          {saving ? "Sparar..." : "Spara"}
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingDetails() {
  const { id } = useParams();

  const [onboarding, setOnboarding] = useState(null);
  const [progress, setProgress] = useState({ total: 0, done: 0, percent: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetchOnboardingById(id);
        if (!alive) return;

        setOnboarding(res.onboarding);
        setProgress(res.progress);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Kunde inte hämta onboardingen.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const tasksSorted = useMemo(() => {
    const tasks = onboarding?.tasks || [];
    return tasks.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [onboarding]);

  function handlePatched(res) {
    setOnboarding(res.onboarding);
    setProgress(res.progress);
  }

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

  const employeeName = onboarding.employee?.fullName || "—";
  const programName = onboarding.program?.name || "—";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Onboarding: {employeeName}
        </h1>
        <p className="text-slate-500">
          Program: <span className="text-slate-700 font-medium">{programName}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>
            {progress.done}/{progress.total} klara ({progress.percent}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar value={progress.percent} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasksSorted.map((task) => (
          <TaskRow
            key={task._id}
            task={task}
            onboardingId={onboarding._id}
            onPatched={handlePatched}
          />
        ))}
      </div>
    </div>
  );
}