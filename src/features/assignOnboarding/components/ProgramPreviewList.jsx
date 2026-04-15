import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StatusPill from "./StatusPill";

export default function ProgramPreviewList({ tasks = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const visibleTasks = useMemo(() => {
    if (isExpanded) return tasks;
    return tasks.slice(0, 5);
  }, [tasks, isExpanded]);

  const hiddenCount = Math.max(0, tasks.length - visibleTasks.length);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">
            Förhandsvisning — kopieras vid start.
          </p>
        </div>

        {tasks.length > 5 ? (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            <span>{isExpanded ? "Dölj" : "Visa"}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        {visibleTasks.map((task, index) => (
          <div
            key={task._id || index}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 shrink-0">
              {task.order ?? index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium leading-tight text-slate-900">
                {task.title}
              </div>

              <div className="mt-0.5 text-[11px] text-slate-500">
                Skapas som en uppgift för {task.status || "Ej startad"}.
              </div>
            </div>

            <StatusPill status={task.status || "Ej startad"} />
          </div>
        ))}
      </div>

      {!isExpanded && hiddenCount > 0 ? (
        <div className="text-xs text-slate-500">
          +{hiddenCount} fler uppgifter
        </div>
      ) : null}
    </div>
  );
}