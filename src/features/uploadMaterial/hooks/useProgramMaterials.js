import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../../services/api";
import { deleteProgramMaterial } from "../../../services/programService";

export function useProgramMaterials(programId) {
  const [program, setProgram] = useState(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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

  const removeMaterial = useCallback(
    async (materialId) => {
      if (!materialId) return;

      
      const prev = program;
      setDeletingId(materialId);
      setProgram((p) => {
        if (!p) return p;
        return { ...p, materials: (p.materials || []).filter((m) => m._id !== materialId) };
      });

      try {
        await deleteProgramMaterial(programId, materialId);
      } catch (err) {
        // rollback om något failar
        setProgram(prev);
        throw err;
      } finally {
        setDeletingId(null);
      }
    },
    [program, programId]
  );

  return {
    program,
    loadingProgram,
    programError,
    materials,
    loadProgram,
    removeMaterial,
    deletingId,
  };
}