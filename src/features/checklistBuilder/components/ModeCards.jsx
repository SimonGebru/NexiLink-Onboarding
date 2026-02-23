export default function ModeCards({ aiLoading, selectedMode, disabled, onSelectMode }) {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Välj hur du vill bygga din checklista
      </h2>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <li className="border-2 border-gray-200 rounded-lg p-6 bg-white">
          <article>
            <h3 className="font-semibold text-gray-900 mb-2">
              Manuell checklistbyggare
            </h3>
            <p className="text-sm mb-3 text-gray-500">
              Bygg din checklista från grunden, uppgift för uppgift.
            </p>
            <p className="text-sm mb-6 text-gray-500">
              Lägg till, redigera och anordna uppgifter med full kontroll över varje detalj.
            </p>

            <button
              type="button"
              onClick={() => onSelectMode(1)}
              disabled={disabled}
              className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors disabled:opacity-60"
            >
              {aiLoading && selectedMode === 1 ? "Genererar…" : "Välj"}
            </button>
          </article>
        </li>

        {/* Card 2 */}
        <li className="border-2 border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-2">
            Mallbaserad: Startmall
          </h3>
          <p className="text-sm mb-3 text-gray-500">
            Använd en fördefinerad mall som du kan anpassa.
          </p>
          <p className="text-sm mb-6 text-gray-500">
            Fyll snabbt i en standardiserad checklista för de första 90 dagarna.
          </p>

          <button
            type="button"
            onClick={() => onSelectMode(2)}
            disabled={disabled}
            className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors disabled:opacity-60"
          >
            {aiLoading && selectedMode === 2 ? "Genererar…" : "Välj"}
          </button>
        </li>

        {/* Card 3 */}
        <li className="border-2 border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-2">
            Autogenerera enkel punktlista
          </h3>
          <p className="text-sm mb-3 text-gray-500">
            Skapa uppgifter från rubriker i befintliga material
          </p>
          <p className="text-sm mb-6 text-gray-500">
            Markera rubriker i uppladdade filer för att automatiskt skapa uppgifterna
          </p>

          <button
            type="button"
            onClick={() => onSelectMode(3)}
            disabled={disabled}
            className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors disabled:opacity-60"
          >
            {aiLoading && selectedMode === 3 ? "Genererar…" : "Välj"}
          </button>
        </li>
      </ul>
    </section>
  );
}