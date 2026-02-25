import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StatusPill from "./StatusPill";

export default function ProgramPreviewList({ tasks = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Visa bara några rader när den är kollapsad
  const visibleTasks = useMemo(() => {
    if (isExpanded) return tasks;
    return tasks.slice(0, 5); 
  }, [tasks, isExpanded]);

  const hiddenCount = Math.max(0, tasks.length - visibleTasks.length);

  return (
    <div className="space-y-3">
      {/* Header + collapse */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">Checklista i programmet</p>
          <p className="text-xs text-slate-500">
            Förhandsvisning – detta kopieras när du klickar “Starta”.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <span>{isExpanded ? "Fäll ihop" : "Visa"}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {visibleTasks.map((t, i) => (
          <div
            key={t._id || i}
            className={[
              "flex items-center justify-between gap-3 px-4 py-3",
              i !== 0 ? "border-t border-slate-100" : "",
            ].join(" ")}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 w-6">
                  {t.order ?? i + 1}.
                </span>
                <p className="text-sm font-medium text-slate-900 truncate">{t.title}</p>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Skapas som en uppgift för {t.status || "Ej startad"}.
              </p>
            </div>

            <StatusPill status={t.status || "Ej startad"} />
          </div>
        ))}
      </div>

      {/* Collapsed helper text */}
      {!isExpanded && hiddenCount > 0 ? (
        <div className="text-xs text-slate-500">
          +{hiddenCount} fler uppgifter (klicka “Visa”)
        </div>
      ) : null}
    </div>
  );
}