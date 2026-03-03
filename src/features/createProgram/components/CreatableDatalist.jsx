export default function CreatableDatalist({
  label,
  value,
  onChange,
  placeholder,
  options = [],
  name = "field",
  disabled = false,
}) {
  const listId = `${name}-datalist`;

  // rensa tomma + dubletter
  const uniqueOptions = Array.from(
    new Set((options || []).map((x) => String(x || "").trim()).filter(Boolean))
  );

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={listId}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 disabled:opacity-60"
      />

      <datalist id={listId}>
        {uniqueOptions.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>

      <p className="text-xs text-slate-400">
        Du kan välja från listan eller skriva helt fritt.
      </p>
    </div>
  );
}