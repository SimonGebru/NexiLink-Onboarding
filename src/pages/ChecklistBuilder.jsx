import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";


function extractHeadingsFromText(text) {
  if (!text) return "";

  const lines = String(text)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Plocka rader som ser rubrikiga ut
  const headings = [];
  for (const line of lines) {
    const isTooLong = line.length > 80;
    const hasPeriod = line.includes(".");
    const hasManyCommas = (line.match(/,/g) || []).length >= 2;

    
    if (isTooLong) continue;
    if (hasPeriod) continue;
    if (hasManyCommas) continue;

    
    if (!/[A-Za-zÅÄÖåäö]/.test(line)) continue;

    headings.push(line);
  }

  
  const seen = new Set();
  const unique = [];
  for (const h of headings) {
    const key = h.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(h);
  }

  // Om vi får för få rubriker, fall back till tom string
  return unique.length >= 2 ? unique.join("\n") : "";
}

export default function ChecklistBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [program, setProgram] = useState(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState("");

  
  const [selectedMode, setSelectedMode] = useState(null); 
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Underlag: välj material + text som faktiskt skickas
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(-1);
  const [inputText, setInputText] = useState("");

  // Mode 3 input type (rubriker/fulltext)
  const [mode3InputType, setMode3InputType] = useState("headings");

  
  const [checklistTitle, setChecklistTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  
  useEffect(() => {
    let alive = true;

    async function loadProgram() {
      try {
        setLoadingProgram(true);
        setProgramError("");

        const data = await apiRequest(`/api/programs/${id}`, { method: "GET" });
        if (!alive) return;

        setProgram(data);

        
        const firstFileIdx =
          Array.isArray(data?.materials)
            ? data.materials.findIndex((m) => m?.type === "file" && m?.fileData)
            : -1;

        if (firstFileIdx >= 0) {
          setSelectedMaterialIndex(firstFileIdx);
          setInputText(String(data.materials[firstFileIdx].fileData || ""));
        } else {
          
          setSelectedMaterialIndex(-1);
          setInputText("");
        }
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

  
  const aiMaterials = useMemo(() => {
    const mats = Array.isArray(program?.materials) ? program.materials : [];
    return mats
      .map((m, idx) => ({ ...m, _idx: idx }))
      .filter((m) => m?.type === "file" && m?.fileData);
  }, [program]);

  
  function handleSelectMaterial(e) {
    const idx = Number(e.target.value);
    setSelectedMaterialIndex(idx);

    const mat = program?.materials?.[idx];
    const text = mat?.fileData ? String(mat.fileData) : "";
    setInputText(text);

    // Rensa AI-resultat när man byter underlag
    setAiError("");
    setChecklistTitle("");
    setTasks([]);
  }

  
  const mode3Hint = useMemo(() => {
    if (mode3InputType === "headings") {
      return "Mode 3 använder rubriker. Vi försöker automatiskt plocka ut rubriker från dokumentet. Om det inte går kan du byta till Fulltext.";
    }
    return "Mode 3 använder fulltext. AI försöker hitta rubriker/ämnesblock själv.";
  }, [mode3InputType]);

  function handleCancel() {
    navigate(`/programs/${id}/material`);
  }

  function handleSaveChecklist() {
    // TODO: POST/PATCH spara checklistan på programmet
    navigate("/onboarding/assign");
  }

  async function callGenerateChecklist(mode) {
    setSelectedMode(mode);
    setAiError("");
    setChecklistTitle("");
    setTasks([]);

    // 1) måste finnas material/text
    const trimmedFulltext = String(inputText || "").trim();
    if (!trimmedFulltext) {
      setAiError(
        "Inget dokumentunderlag hittades. Ladda upp minst en fil (PDF/DOCX/PPTX) på materialsidan först."
      );
      return;
    }

    // 2) bestäm vilken text vi skickar (mode 3 kan skicka rubriker)
    let textToSend = trimmedFulltext;

    if (mode === 3 && mode3InputType === "headings") {
      const extracted = extractHeadingsFromText(trimmedFulltext);

      if (!extracted) {
        setAiError(
          "Kunde inte hitta tydliga rubriker automatiskt i dokumentet. Byt till 'Fulltext' för Mode 3, eller se till att dokumentet har rubriker på egna rader."
        );
        return;
      }

      
      const lines = extracted
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        setAiError(
          "Mode 3 (Rubriker) behöver minst 2 rubriker. Byt till 'Fulltext' eller använd ett dokument med fler rubriker."
        );
        return;
      }

      textToSend = extracted;
    }

    try {
      setAiLoading(true);

      const result = await apiRequest(`/api/dev/ai/generate-checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          text: textToSend,
          
          sourceType: mode === 3 ? mode3InputType : "fulltext",
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

      {/* Underlag: välj material istället för att klistra in */}
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
              Välj vilket uppladdat dokument som ska användas för att generera checklistan.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="text-sm font-medium text-gray-700">
                Dokument:
              </label>

              <select
                value={selectedMaterialIndex}
                onChange={handleSelectMaterial}
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

            {/* Debug/preview (valfritt): visar att vi faktiskt har text */}
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
                disabled={aiLoading || aiMaterials.length === 0}
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
              disabled={aiLoading || aiMaterials.length === 0}
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
              disabled={aiLoading || aiMaterials.length === 0}
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

        {aiError ? <p className="text-sm text-red-600 mb-4">{aiError}</p> : null}
        {aiLoading ? <p className="text-sm text-gray-500 mb-4">AI genererar checklista…</p> : null}

        {!aiLoading && checklistTitle ? (
          <p className="text-sm text-gray-600 mb-4">
            Titel: <span className="font-semibold">{checklistTitle}</span>
          </p>
        ) : null}

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

                  {task.phase ? (
                    <div className="mt-2 text-xs text-gray-500">
                      Fas: <span className="font-medium">{task.phase}</span>
                    </div>
                  ) : null}

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
