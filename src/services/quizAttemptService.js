import { apiRequest } from "./api";

export function fetchOnboardingQuizAttempts(onboardingId) {
  return apiRequest(`/api/onboardings/${onboardingId}/quiz-attempts`, {
    method: "GET",
  });
}