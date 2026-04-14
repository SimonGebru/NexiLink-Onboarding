import { ChevronRight } from "lucide-react";

export default function ListItem({ title, subtitle, right }) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:bg-slate-50 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-900">{title}</div>

        {subtitle ? (
          <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div>
        ) : null}
      </div>

      <div className="ml-3 flex items-center gap-2 shrink-0">
        {right}
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}