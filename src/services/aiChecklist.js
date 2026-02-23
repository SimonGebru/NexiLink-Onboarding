import { apiRequest } from "./api";

/**
 * Enkel: generera från text (fallback/test)
 * POST /api/dev/ai/generate-checklist
 */
export function generateChecklist({ mode, text, sourceType }) {
  return apiRequest("/api/dev/ai/generate-checklist", {
    method: "POST",
    body: JSON.stringify({ mode, text, sourceType }),
  });
}

/**
 * Viktig: generera från uppladdade materials (kombinerar flera filer i backend)
 * POST /api/dev/ai/generate-checklist-from-materials
 */
export function generateChecklistFromMaterials({
  programId,
  materialIds,
  mode,
  sourceType, // "headings" | "fulltext"
}) {
  return apiRequest("/api/dev/ai/generate-checklist-from-materials", {
    method: "POST",
    body: JSON.stringify({ programId, materialIds, mode, sourceType }),
  });
}