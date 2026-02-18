import { apiRequest } from "./api";

export async function generateChecklist({ mode, text }) {
  return apiRequest("/api/dev/ai/generate-checklist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, text }),
  });
}