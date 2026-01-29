import { apiRequest } from "./api";

export function fetchPrograms() {
  return apiRequest("/api/programs", { method: "GET" });
}

export function createProgram(payload) {
  return apiRequest("/api/programs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}