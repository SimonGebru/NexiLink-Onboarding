import { FileText, Link as LinkIcon } from "lucide-react";
import { Textarea } from "../../../components/ui/Form";
import StatusPill from "./StatusPill";

export default function TaskCard({ title, items = [], status = "Ej startad", comment = "" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>

          <div className="mt-2 space-y-1">
            {items.map((it, idx) => (
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
        </div>

        <StatusPill status={status} />
      </div>

      <div className="mt-3">
        <Textarea className="min-h-[90px] text-sm" rows={4} value={comment} readOnly />
      </div>
    </div>
  );
}