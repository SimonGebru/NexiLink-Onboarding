import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function ChecklistBuilder() {
  const navigate = useNavigate();
  const { id } = useParams(); 

 
  const [program, setProgram] = useState(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState("");

  
  // AI / checklist state
  const [selectedMode, setSelectedMode] = useState(null); // 1 | 2 | 3
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Det som ska skickas till backend (mode + text)
  const [inputText, setInputText] = useState("");

  // Mode 3 behöver kunna hantera rubriker (markerade) eller fulltext
  // Backend tar fortfarande bara emot { mode, text }.
  // Den här togglen styr bara HUR vi ber användaren klistra in texten.
  const [mode3InputType, setMode3InputType] = useState("headings"); 

 
  const [checklistTitle, setChecklistTitle] = useState("");
  const [tasks, setTasks] = useState([]); 

 
  // Load program
  
  useEffect(() => {
    let alive = true;

    async function loadProgram() {
      try {
        setLoadingProgram(true);
        setProgramError("");

        const data = await apiRequest(`/api/programs/${id}`, { method: "GET" });

        if (!alive) return;
        setProgram(data);
      } catch (err) {
        if (!alive) return;
        setProgramError(err?.message || "Kunde inte hämta programmet.");
      } finally {
        if (!alive) return;
        setLoadingProgram(false);
      }
    }

    if (!id) {
      setProgramError("Saknar program-ID i URL.");
      setLoadingProgram(false);
      return;
    }

    loadProgram();
    return () => {
      alive = false;
    };
  }, [id]);

 
  // Helpers
 
  const mode3Hint = useMemo(() => {
    if (mode3InputType === "headings") {
      return (
        "Klistra in EN rubrik per rad (precis det du markerat i dokumentet). " +
        "Exempel:\n" +
        "Arbetsmiljö och säkerhet\n" +
        "IT-policy\n" +
        "Kommunikation\n"
      );
    }
    return (
      "Klistra in hela texten (fulltext från dokumentet). " +
      "AI försöker då hitta rubriker/ämnesblock och göra en punktlista."
    );
  }, [mode3InputType]);

  function handleCancel() {
    navigate(`/programs/${id}/material`);
  }

  function handleSaveChecklist() {
    // Senare: POST/PATCH checklist kopplad till programId
    // Nu: fortsätt flödet som du redan tänkt: tilldela onboarding
    navigate("/onboarding/assign");
  }

  async function callGenerateChecklist(mode) {
   
    setSelectedMode(mode);
    setAiError("");
    setChecklistTitle("");
    setTasks([]);

    // Grundvalidering 
    const trimmed = (inputText || "").trim();
    if (!trimmed) {
      setAiError("Skriv in text (rubriker eller fulltext) innan du klickar Välj.");
      return;
    }

    // Om mode 3 + headings, säkerställ att det faktiskt är flera rader/rubriker
    if (mode === 3 && mode3InputType === "headings") {
      const lines = trimmed
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        setAiError(
          "Mode 3 (Rubriker) behöver minst 2 rubriker, en per rad. " +
            "Annars välj 'Fulltext' eller lägg till fler rubriker."
        );
        return;
      }
    }

    try {
      setAiLoading(true);

      // Anropa backend:
      // POST /api/dev/ai/generate-checklist
      // body: { mode, text }
      const result = await apiRequest(`/api/dev/ai/generate-checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          text: trimmed,
        }),
      });

      setChecklistTitle(result?.checklistTitle || "");
      setTasks(Array.isArray(result?.items) ? result.items : []);
    } catch (err) {
      setAiError(err?.message || "AI-anropet misslyckades.");
    } finally {
      setAiLoading(false);
    }
  }

  
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-10 space-y-1">
        <h1 className="font-bold text-2xl">Checklistbyggare</h1>

        {loadingProgram ? (
          <p className="text-sm text-gray-500">Hämtar program…</p>
        ) : programError ? (
          <p className="text-sm text-red-600">{programError}</p>
        ) : (
          <p className="text-sm text-gray-600">
            Program: <span className="font-semibold">{program?.name}</span>
          </p>
        )}
      </header>

      {/* Confirmation */}
      <aside className="border-2 border-gray-200 px-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mt-2">
          <BadgeCheck /> Klart!
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Programmet har en checklista kopplad.
        </p>
      </aside>

      {/* Input (det som skickas till AI) */}
      <section className="mt-6 border-2 border-gray-200 rounded-lg p-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Underlag till checklistan
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          Just nu klistrar du in text här (sen kopplar ni detta till uppladdade dokument).
        </p>

        {/* Mode 3 input type toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
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
            Rubriker (en per rad)
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
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder={mode3Hint}
        />
      </section>

      {/* Cards */}
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
                onClick={() => callGenerateChecklist(1)}
                disabled={aiLoading}
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
              onClick={() => callGenerateChecklist(2)}
              disabled={aiLoading}
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
              onClick={() => callGenerateChecklist(3)}
              disabled={aiLoading}
              className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors disabled:opacity-60"
            >
              {aiLoading && selectedMode === 3 ? "Genererar…" : "Välj"}
            </button>
          </li>
        </ul>
      </section>

      {/* Lägg till och redigera */}
      <section className="w-full bg-white p-4 mt-6 border-2 border-gray-200 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Lägg till och redigera uppgifter
        </h3>

        {/* AI status */}
        {aiError ? (
          <p className="text-sm text-red-600 mb-4">{aiError}</p>
        ) : null}

        {aiLoading ? (
          <p className="text-sm text-gray-500 mb-4">AI genererar checklista…</p>
        ) : null}

        {/* Titel från AI */}
        {!aiLoading && checklistTitle ? (
          <p className="text-sm text-gray-600 mb-4">
            Titel: <span className="font-semibold">{checklistTitle}</span>
          </p>
        ) : null}

        {/* Uppgifter */}
        <section className="border-t border-gray-200">
          {tasks.length === 0 && !aiLoading ? (
            <div className="py-6 text-sm text-gray-500">
              Inga uppgifter ännu. Välj ett mode ovan för att generera en startlista,
              eller lägg till manuellt.
            </div>
          ) : null}

          {tasks.map((task) => (
            <div
              key={task.order ?? task.title}
              className="py-5 border-b border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-gray-900 font-medium truncate">
                    {task.order ? `${task.order}. ` : ""}
                    {task.title}
                  </div>

                  {task.description ? (
                    <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                  ) : null}

                  {/* Visa phase om den finns */}
                  {task.phase ? (
                    <div className="mt-2 text-xs text-gray-500">
                      Fas: <span className="font-medium">{task.phase}</span>
                    </div>
                  ) : null}

                  {/* Visa frågor om de finns */}
                  {Array.isArray(task.questions) && task.questions.length > 0 ? (
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {task.questions.slice(0, 3).map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="text-gray-400 text-sm hover:text-slate-900 ml-4"
                  title="Redigera / lägg till detaljer (sen)"
                >
                  <Plus />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Footer btns */}
        <div className="mt-6 flex">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Lägg till uppgift
          </button>
        </div>

        <div className="mt-12 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>

          <button
            type="button"
            onClick={handleSaveChecklist}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Spara checklista
          </button>
        </div>
      </section>
    </div>
  );
}
