export default function StatusPill({ status }) {
  const map = {
    Klar: {
      tone: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-500",
    },
    Pågår: {
      tone: "bg-blue-100 text-blue-700",
      dot: "bg-blue-500",
    },
    "Ej startad": {
      tone: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    },
  };

  const current = map[status] || map["Ej startad"];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full",
        "px-3 py-1 text-xs font-medium transition-colors duration-200",
        current.tone,
      ].join(" ")}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
      />
      {status}
    </span>
  );
}