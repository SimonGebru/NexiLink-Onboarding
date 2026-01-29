import { apiRequest } from "./api";

export function fetchPrograms() {
  // ÄNDRA path om din backend har annat, t.ex. /api/programs
  return apiRequest("/api/programs", { method: "GET" });
}

export function fetchActiveOnboardings() {
  // ÄNDRA path om din backend har annat, t.ex. /api/onboarding
  return apiRequest("/api/onboardings", { method: "GET" });
}