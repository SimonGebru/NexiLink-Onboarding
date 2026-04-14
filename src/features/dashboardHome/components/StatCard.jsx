export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-5">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </div>

      {hint ? (
        <div className="mt-1 text-sm text-slate-500">{hint}</div>
      ) : null}
    </div>
  );
}