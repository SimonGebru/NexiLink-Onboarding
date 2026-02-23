export default function ProgressBar({ value = 0 }) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-900">
          Procent klar: {safe}%
        </div>
        <div className="text-xs text-slate-500">Senast uppdaterad: idag</div>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-[#1A4D4F]" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}