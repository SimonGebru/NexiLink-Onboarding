export default function StatusPill({ status }) {
  const map = {
    Klar: "bg-green-50 text-green-700 border border-green-200",
    Pågår: "bg-blue-50 text-blue-700 border border-blue-200",
    "Ej startad": "bg-slate-50 text-slate-700 border border-slate-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        map[status] || map["Ej startad"],
      ].join(" ")}
    >
      {status}
    </span>
  );
}