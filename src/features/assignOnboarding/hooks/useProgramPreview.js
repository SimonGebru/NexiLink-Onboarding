import { useEffect, useMemo, useState } from "react";
import { fetchProgramById } from "../../../services/programService";

export function useProgramPreview(selectedProgramId) {
  const [programPreview, setProgramPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      // Ingen program-id => ingen preview
      if (!selectedProgramId) {
        setProgramPreview(null);
        setPreviewError("");
        setPreviewLoading(false);
        return;
      }

      try {
        setPreviewLoading(true);
        setPreviewError("");

        const data = await fetchProgramById(selectedProgramId);
        if (!alive) return;

        setProgramPreview(data || null);
      } catch (err) {
        if (!alive) return;
        setProgramPreview(null);
        setPreviewError(err?.message || "Kunde inte hämta programmet.");
      } finally {
        if (!alive) return;
        setPreviewLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [selectedProgramId]);

  // Gör om Program.checklistTemplate till samma form som TaskCard gillar
  const previewTasks = useMemo(() => {
    const tpl = programPreview?.checklistTemplate;
    if (!Array.isArray(tpl)) return [];

    return tpl
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((t) => ({
        _id: t?._id || `${t?.order ?? ""}-${t?.title ?? "task"}`,
        title: t?.title || "Uppgift",
        status: t?.defaultStatus || "Ej startad",
        items: [], // finns inte i template (kommer när onboarding skapas)
        comment: "", // finns inte i template
        order: t?.order ?? null,
      }));
  }, [programPreview]);

  return { programPreview, previewTasks, previewLoading, previewError };
}