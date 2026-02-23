export default function ActivityCard({ title, subtitle, rightText }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-sm text-slate-500">{subtitle}</div>
        </div>
        {rightText ? (
          <div className="text-xs text-slate-400 whitespace-nowrap">{rightText}</div>
        ) : null}
      </div>
    </div>
  );
}