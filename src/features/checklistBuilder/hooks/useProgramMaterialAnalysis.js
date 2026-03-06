import { useCallback, useState } from "react";
import {
  analyzeProgramMaterials,
  fetchLatestProgramAnalysis,
} from "../../../services/programAnalysisService";

export default function useProgramMaterialAnalysis({
  programId,
  materialIds,
  sourceType,
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLatest = useCallback(async () => {
    try {
      if (!programId) throw new Error("programId saknas");

      setLoading(true);
      setError("");

      const res = await fetchLatestProgramAnalysis(programId);
      setAnalysis(res?.analysis || null);
    } catch (err) {
      setError(err?.message || "Kunde inte hämta senaste analysen.");
    } finally {
      setLoading(false);
    }
  }, [programId]);

  const runAnalysis = useCallback(
    async (force = false) => {
      try {
        if (!programId) throw new Error("programId saknas");
        if (!Array.isArray(materialIds) || materialIds.length === 0) {
          throw new Error("Välj minst 1 fil innan du analyserar.");
        }

        setLoading(true);
        setError("");

        const res = await analyzeProgramMaterials(programId, {
          materialIds,
          force,
          sourceType,
        });

        setAnalysis(res?.analysis || null);
      } catch (err) {
        setError(err?.message || "Analysen misslyckades.");
      } finally {
        setLoading(false);
      }
    },
    [programId, materialIds, sourceType]
  );

  return {
    analysis,
    loading,
    error,
    loadLatest,
    runAnalysis,
    setError,
  };
}