import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../../services/api";

export function useProgramMaterials(programId) {
  const [program, setProgram] = useState(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState("");

  const loadProgram = useCallback(async () => {
    if (!programId) {
      setProgramError("Saknar program-ID i URL.");
      setLoadingProgram(false);
      return;
    }

    try {
      setLoadingProgram(true);
      setProgramError("");
      const data = await apiRequest(`/api/programs/${programId}`, { method: "GET" });
      setProgram(data);
    } catch (err) {
      setProgramError(err?.message || "Kunde inte hämta programmet.");
    } finally {
      setLoadingProgram(false);
    }
  }, [programId]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!alive) return;
      await loadProgram();
    })();

    return () => {
      alive = false;
    };
  }, [loadProgram]);

  const materials = useMemo(() => program?.materials || [], [program]);

  return {
    program,
    loadingProgram,
    programError,
    materials,
    loadProgram,
  };
}