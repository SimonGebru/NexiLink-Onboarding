import { useEffect, useState } from "react";
import { FileText, Link as LinkIcon } from "lucide-react";

import { Textarea, Select } from "../../../components/ui/Form";
import Button from "../../../components/ui/Button";

import StatusPill from "./StatusPill";
import { updateOnboardingTask } from "../../../services/onboardingService";

export default function TaskRow({ task, onboardingId, onPatched }) {
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
          <Select className="h-11" value={status} onChange={(e) => setStatus(e.target.value)}>
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