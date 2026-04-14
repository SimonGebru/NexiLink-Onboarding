export default function ActivityCard({ title, subtitle, rightText }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-5 text-slate-900">
            {title}
          </div>

          {subtitle ? (
            <div className="mt-1 text-sm leading-5 text-slate-500 whitespace-pre-line">
              {subtitle}
            </div>
          ) : null}
        </div>

        {rightText ? (
          <div className="shrink-0 text-xs text-slate-400 whitespace-nowrap">
            {rightText}
          </div>
        ) : null}
      </div>
    </div>
  );
}