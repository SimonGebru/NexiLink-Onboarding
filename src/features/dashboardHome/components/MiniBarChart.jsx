export default function MiniBarChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-slate-900">Aktivitet</div>
        <div className="text-xs text-slate-400">Senaste 7 dagar</div>
      </div>

      <div className="relative rounded-lg border border-slate-200 bg-slate-50 px-3 pt-3 pb-2">
        <div className="absolute inset-x-3 top-3 bottom-7 pointer-events-none">
          <div className="h-full flex flex-col justify-between">
            <div className="h-px bg-slate-200/70" />
            <div className="h-px bg-slate-200/60" />
            <div className="h-px bg-slate-200/50" />
          </div>
        </div>

        <div className="relative h-24 flex items-end justify-between gap-3 pt-2">
          {data.map((d) => {
            const h = Math.max(6, Math.round((d.value / max) * 96));
            return (
              <div key={d.label} className="flex flex-col items-center flex-1">
                <div className="w-full flex items-end justify-center h-24">
                  <div
                    className="w-[14px] rounded-t-md bg-[#1A4D4F]/90 shadow-sm"
                    style={{ height: `${h}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          {data.map((d) => (
            <div
              key={`${d.label}-x`}
              className="flex-1 text-center text-[11px] text-slate-400"
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Visuell placeholder – kopplas till riktig statistik senare.
      </p>
    </div>
  );
}