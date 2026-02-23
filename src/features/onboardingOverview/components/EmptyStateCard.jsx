export default function EmptyStateCard({ title, description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}