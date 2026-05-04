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
