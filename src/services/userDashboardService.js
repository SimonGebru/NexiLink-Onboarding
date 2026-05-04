import { apiRequest } from "./api";

export async function fetchMyOnboardings() {
  return apiRequest("/api/me/onboardings", { method: "GET" });
}
