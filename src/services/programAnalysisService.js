import { apiRequest } from "./api";

export function fetchLatestProgramAnalysis(programId) {
  if (!programId) throw new Error("programId saknas");

  // Backend: GET /api/programs/:id/analysis/latest
  return apiRequest(`/api/programs/${programId}/analysis/latest`, {
    method: "GET",
  });
}

export function analyzeProgramMaterials(
  programId,
  { materialIds, force = false, sourceType } = {}
) {
  if (!programId) throw new Error("programId saknas");
  if (!Array.isArray(materialIds) || materialIds.length === 0) {
    throw new Error("materialIds saknas");
  }

  // Backend: POST /api/programs/:id/analysis
  return apiRequest(`/api/programs/${programId}/analysis`, {
    method: "POST",
    body: JSON.stringify({
      materialIds,
      force,
      sourceType,
    }),
  });
}