import { apiRequest } from "./api";

export function fetchMyOnboardingById(id) {
  return apiRequest(`/api/me/onboardings/${id}`, { method: "GET" });
}

export function updateMyOnboardingTask(onboardingId, taskId, payload) {
  return apiRequest(`/api/me/onboardings/${onboardingId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getOnboardingQuiz(onboardingId) {
  return apiRequest(`/api/me/onboardings/${onboardingId}/quiz`, {
    method: "GET",
  });
}

export function submitQuizAnswer(onboardingId, answers) {
  return apiRequest(`/api/onboardings/${onboardingId}/quiz-attempts`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}
