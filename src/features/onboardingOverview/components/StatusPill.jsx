export default function StatusPill({ status }) {
  const map = {
    Pågår: "bg-blue-50 text-blue-700 border-blue-200",
    "Ej startad": "bg-slate-50 text-slate-700 border-slate-200",
    Klar: "bg-green-50 text-green-700 border-green-200",
    Pausad: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        map[status] || map["Ej startad"],
      ].join(" ")}
    >
      {status}
    </span>
  );
}