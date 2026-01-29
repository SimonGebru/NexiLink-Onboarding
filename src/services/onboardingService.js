import { apiRequest } from "./api";

export function fetchPrograms() {
  
  return apiRequest("/api/programs", { method: "GET" });
}

export function fetchActiveOnboardings() {
  
  return apiRequest("/api/onboardings", { method: "GET" });
}