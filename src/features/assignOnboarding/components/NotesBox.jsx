export default function NotesBox() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">
        Viktiga anmärkningar (MVP/V1)
      </div>

      <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-1.5">
        <li>Ingen AI-analys</li>
        <li>Inga automatiska påminnelser</li>
        <li>Enkel checklist + materialhantering = status</li>
      </ul>
    </div>
  );
}