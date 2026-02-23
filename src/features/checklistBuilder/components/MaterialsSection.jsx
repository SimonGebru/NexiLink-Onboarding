export default function MaterialsSection({
  aiMaterials,
  selectedMaterialIds,
  handleToggleMaterialId,

  selectedMaterialIndex,
  onSelectMaterial,

  mode3InputType,
  setMode3InputType,
  mode3Hint,

  inputText,
}) {
  return (
    <section className="mt-6 border-2 border-gray-200 rounded-lg p-4 bg-white">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Underlag till checklistan
      </h2>

      {aiMaterials.length === 0 ? (
        <p className="text-sm text-red-600">
          Inga uppladdade filer hittades i detta program. Gå tillbaka till material-sidan
          och ladda upp minst en fil (PDF/DOCX/PPTX).
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">
            Välj vilka uppladdade dokument som ska användas för att generera checklistan.
            (Förvalt: alla filer upp till 5 st)
          </p>

          {/* Checkbox-lista */}
          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Välj filer (max 5):
            </div>

            <div className="space-y-2">
              {aiMaterials.map((m) => {
                const idStr = String(m._id);
                const checked = selectedMaterialIds.includes(idStr);

                return (
                  <label
                    key={idStr}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleMaterialId(m._id)}
                      className="h-4 w-4 accent-slate-900"
                    />
                    <span className="truncate">
                      {m.title || m.fileName || "Uppladdad fil"}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Valda: {selectedMaterialIds.length}/5
            </div>
          </div>

          {/* Dropdown (förhandsvisning/debug) */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-4">
            <label className="text-sm font-medium text-gray-700">
              Dokument (förhandsvisning):
            </label>

            <select
              value={selectedMaterialIndex}
              onChange={onSelectMaterial}
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {aiMaterials.map((m) => (
                <option key={m._idx} value={m._idx}>
                  {m.title || m.fileName || "Uppladdad fil"}
                </option>
              ))}
            </select>
          </div>

          {/* Mode 3 input type toggle */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-sm font-medium text-gray-700">Mode 3 input:</span>

            <button
              type="button"
              onClick={() => setMode3InputType("headings")}
              className={`px-3 py-1 rounded border text-sm ${
                mode3InputType === "headings"
                  ? "border-slate-900 text-slate-900"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Rubriker (auto)
            </button>

            <button
              type="button"
              onClick={() => setMode3InputType("fulltext")}
              className={`px-3 py-1 rounded border text-sm ${
                mode3InputType === "fulltext"
                  ? "border-slate-900 text-slate-900"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Fulltext
            </button>

            <span className="text-xs text-gray-500">{mode3Hint}</span>
          </div>

          {/* Debug/preview */}
          <details className="mt-4">
            <summary className="text-sm text-gray-600 cursor-pointer">
              Förhandsgranska underlag (debug)
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700 whitespace-pre-wrap">
              {String(inputText || "").slice(0, 3000)}
              {String(inputText || "").length > 3000 ? "\n…(trimmat)" : ""}
            </pre>
          </details>
        </>
      )}
    </section>
  );
}