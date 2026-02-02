import { apiRequest } from "./api";

export function createOnboarding(payload) {
  return apiRequest("/api/onboardings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchOnboardingById(id) {
  return apiRequest(`/api/onboardings/${id}`, { method: "GET" });
}

export function updateOnboardingTask(onboardingId, taskId, payload) {
  return apiRequest(`/api/onboardings/${onboardingId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
export function fetchOnboardings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `/api/onboardings?${qs}` : "/api/onboardings";
  return apiRequest(url, { method: "GET" });
}