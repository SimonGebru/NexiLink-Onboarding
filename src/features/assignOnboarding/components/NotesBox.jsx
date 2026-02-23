export default function NotesBox() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">
        Viktiga anmärkningar (MVP/V1)
      </div>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
        <li>Ingen AI-analys</li>
        <li>Inga automatiska påminnelser</li>
        <li>Enkel checklist + materialhantering = status</li>
      </ul>
    </div>
  );
}