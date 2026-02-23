import { useMemo, useState } from "react";
import { apiRequest } from "../../../services/api";
import { extractHeadingsFromText } from "../utils/extractHeadingsFromText";

export function useChecklistGenerator({
  programId,
  aiMaterials,
  inputText,
  selectedMaterialIds,
  setSelectedMaterialIds,
}) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [mode3InputType, setMode3InputType] = useState("headings");

  const [checklistTitle, setChecklistTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  function resetAiState() {
    setAiError("");
    setChecklistTitle("");
    setTasks([]);
  }

  // toggle för checkbox-val
  function handleToggleMaterialId(materialId) {
    const idStr = String(materialId);

    setAiError(""); // om man får “max 5”-fel vill vi kunna rensa det när man klickar

    setSelectedMaterialIds((prev) => {
      const exists = prev.includes(idStr);

      if (exists) {
        return prev.filter((x) => x !== idStr);
      }

      // backend har max 5 materials
      if (prev.length >= 5) {
        setAiError("Du kan max välja 5 filer åt gången (backend-begränsning).");
        return prev;
      }

      return [...prev, idStr];
    });
  }

  const mode3Hint = useMemo(() => {
    if (mode3InputType === "headings") {
      return "Mode 3 använder rubriker. Vi försöker automatiskt plocka ut rubriker från dokumentet. Om det inte går kan du byta till Fulltext.";
    }
    return "Mode 3 använder fulltext. AI försöker hitta rubriker/ämnesblock själv.";
  }, [mode3InputType]);

  async function callGenerateChecklist(mode) {
    setSelectedMode(mode);
    setAiError("");
    setChecklistTitle("");
    setTasks([]);

    // 0) måste finnas uppladdade filer
    if (aiMaterials.length === 0) {
      setAiError(
        "Inga uppladdade filer hittades. Ladda upp minst en fil (PDF/DOCX/PPTX) på materialsidan först."
      );
      return;
    }

    // 1) måste ha valt minst 1 material
    if (!Array.isArray(selectedMaterialIds) || selectedMaterialIds.length === 0) {
      setAiError("Välj minst 1 fil i listan (checkbox) innan du genererar.");
      return;
    }

    // 2) backend begränsning: max 5
    if (selectedMaterialIds.length > 5) {
      setAiError("Du kan max välja 5 filer åt gången (backend-begränsning).");
      return;
    }

    // 3) sourceType: mode 1/2 ska vara fulltext, mode 3 kan vara headings/fulltext
    const sourceTypeToSend = mode === 3 ? mode3InputType : "fulltext";

    // 4) Om mode 3 + headings: sanity-check med preview-texten
    if (mode === 3 && mode3InputType === "headings") {
      const trimmedFulltext = String(inputText || "").trim();
      if (trimmedFulltext) {
        const extracted = extractHeadingsFromText(trimmedFulltext);
        if (!extracted) {
          setAiError(
            "Kunde inte hitta tydliga rubriker automatiskt i det valda dokumentet (preview). " +
              "Byt till 'Fulltext' för Mode 3, eller se till att dokumentet har rubriker på egna rader."
          );
          return;
        }
      }
    }

    try {
      setAiLoading(true);

      const result = await apiRequest(`/api/dev/ai/generate-checklist-from-materials`, {
        method: "POST",
        body: JSON.stringify({
          programId,
          materialIds: selectedMaterialIds,
          mode,
          sourceType: sourceTypeToSend,
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

  return {
    // state
    selectedMode,
    aiLoading,
    aiError,
    checklistTitle,
    tasks,

    mode3InputType,
    setMode3InputType,
    mode3Hint,

    // helpers/handlers
    resetAiState,
    handleToggleMaterialId,
    callGenerateChecklist,
    setAiError, // ibland skönt att kunna sätta från UI
    setChecklistTitle,
    setTasks,
  };
}