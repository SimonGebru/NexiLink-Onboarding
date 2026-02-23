import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../../services/api";

export function useChecklistBuilderProgram(programId) {
  const [program, setProgram] = useState(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState("");

  // Underlag: välj material + text som faktiskt skickas (preview/debug)
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(-1);
  const [inputText, setInputText] = useState("");

  // Alternativ 2): checkbox-lista där flera filer kan väljas samtidigt
  const [selectedMaterialIds, setSelectedMaterialIds] = useState([]);

  useEffect(() => {
    let alive = true;

    async function loadProgram() {
      try {
        setLoadingProgram(true);
        setProgramError("");

        const data = await apiRequest(`/api/programs/${programId}`, { method: "GET" });
        if (!alive) return;

        setProgram(data);

        // Behåll din gamla logik som sätter första filen som “preview”
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

        // förvälj ALLA filer (upp till 5) för checkbox-läget
        const fileMaterials = Array.isArray(data?.materials)
          ? data.materials.filter((m) => m?.type === "file" && m?.fileData && m?._id)
          : [];

        const preselected = fileMaterials.slice(0, 5).map((m) => String(m._id));
        setSelectedMaterialIds(preselected);
      } catch (err) {
        if (!alive) return;
        setProgramError(err?.message || "Kunde inte hämta programmet.");
      } finally {
        if (!alive) return;
        setLoadingProgram(false);
      }
    }

    if (!programId) {
      setProgramError("Saknar program-ID i URL.");
      setLoadingProgram(false);
      return;
    }

    loadProgram();
    return () => {
      alive = false;
    };
  }, [programId]);

  const aiMaterials = useMemo(() => {
    const mats = Array.isArray(program?.materials) ? program.materials : [];
    return mats
      .map((m, idx) => ({ ...m, _idx: idx }))
      .filter((m) => m?.type === "file" && m?.fileData);
  }, [program]);

  function handleSelectMaterial(e, onResetAiState) {
    const idx = Number(e.target.value);
    setSelectedMaterialIndex(idx);

    const mat = program?.materials?.[idx];
    const text = mat?.fileData ? String(mat.fileData) : "";
    setInputText(text);

    // Rensa AI-resultat när man byter underlag
    if (typeof onResetAiState === "function") onResetAiState();
  }

  return {
    program,
    loadingProgram,
    programError,

    aiMaterials,

    selectedMaterialIndex,
    inputText,

    selectedMaterialIds,
    setSelectedMaterialIds,

    handleSelectMaterial,
  };
}