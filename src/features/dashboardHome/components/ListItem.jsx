import { ChevronRight } from "lucide-react";

export default function ListItem({ title, subtitle, right }) {
  return (
    <div className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 hover:border-slate-300 transition-colors">
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