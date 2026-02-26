import { apiRequest } from "./api";

export function fetchPrograms() {
  return apiRequest("/api/programs", { method: "GET" });
}

export function createProgram(payload) {
  return apiRequest("/api/programs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Uploadar materialfiler till ett program.
 * Backend: POST /api/programs/:id/materials (multipart/form-data, field name "files")
 */
export function uploadProgramMaterials(programId, files) {
  if (!programId) throw new Error("programId saknas");
  if (!files || files.length === 0) return Promise.resolve({ success: true, materials: [] });

  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file); // <-- måste heta "files"
  }

  // Sätt INTE Content-Type själv här
  return apiRequest(`/api/programs/${programId}/materials`, {
    method: "POST",
    body: formData,
  });
}

export async function fetchProgramById(id) {
  return apiRequest(`/api/programs/${id}`, { method: "GET" });
}

export function updateProgramMaterial(programId, materialId, payload) {
  if (!programId) throw new Error("programId saknas");
  if (!materialId) throw new Error("materialId saknas");

  return apiRequest(`/api/programs/${programId}/materials/${materialId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteProgramMaterial(programId, materialId) {
  if (!programId) throw new Error("programId saknas");
  if (!materialId) throw new Error("materialId saknas");

  return apiRequest(`/api/programs/${programId}/materials/${materialId}`, {
    method: "DELETE",
  });
}