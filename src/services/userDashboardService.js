import { apiRequest } from "./api";

export function fetchMyOnboardings() {
  return apiRequest("/api/onboardings/me", {
    method: "GET",
  });
}