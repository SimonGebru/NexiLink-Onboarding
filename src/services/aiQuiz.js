import { apiRequest } from "./api";

export function generateProgramQuiz(
  programId,
  { materialIds, questionCount, language, force = false },
) {
  return apiRequest(`/api/programs/${programId}/quiz`, {
    method: "POST",
    body: JSON.stringify({ materialIds, questionCount, language, force }),
  });
}

export function fetchLatestProgramQuiz(programId) {
  return apiRequest(`/api/programs/${programId}/quiz`, {
    method: "GET",
  });
}
