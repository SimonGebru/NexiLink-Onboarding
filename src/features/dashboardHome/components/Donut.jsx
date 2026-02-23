export default function Donut({ value = 0, label }) {
  const safe = Math.max(0, Math.min(100, value));
  const deg = safe * 3.6;

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-14 w-14 rounded-full"
        style={{
          background: `conic-gradient(#1A4D4F ${deg}deg, #E2E8F0 0deg)`,
        }}
      >
        <div className="absolute inset-[6px] rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-semibold text-slate-900">{safe}%</span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">{label}</div>
      </div>
    </div>
  );
}