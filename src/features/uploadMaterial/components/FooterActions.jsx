import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeProgramMaterials } from "../../../services/programAnalysisService";

export default function FooterActions({ programId, onCancel, materials = [] }) {
  const navigate = useNavigate();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const selectedMaterialIds = useMemo(() => {
    return (Array.isArray(materials) ? materials : [])
      .filter((m) => m?.type === "file" && m?._id)
      .slice(0, 5)
      .map((m) => String(m._id));
  }, [materials]);

  async function handleContinue() {
    setAnalysisError("");

    if (!programId) {
      setAnalysisError("Saknar program-ID.");
      return;
    }

    // Om det inte finns några filer alls går vi vidare ändå,
    // men checklistbyggaren kommer då visa att inget underlag finns.
    if (selectedMaterialIds.length === 0) {
      navigate(`/programs/${programId}/checklist`);
      return;
    }

    try {
      setAnalyzing(true);

      await analyzeProgramMaterials(programId, {
        materialIds: selectedMaterialIds,
        sourceType: "fulltext",
        force: false,
      });

      navigate(`/programs/${programId}/checklist`);
    } catch (err) {
      setAnalysisError(err?.message || "Kunde inte analysera materialet.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <>
      <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={analyzing}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          Avbryt
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={analyzing}
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? "Analyserar material..." : "Fortsätt till checklistbyggaren"}
        </button>
      </div>

      {analysisError ? (
        <p className="mt-3 text-sm text-red-600">{analysisError}</p>
      ) : null}

      {analyzing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-lg">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900">
                Materialet analyseras
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Vi går igenom dokumenten och förbereder checklistbyggaren.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}