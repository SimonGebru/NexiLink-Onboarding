import { apiRequest } from "./api";

export function fetchEmployees() {
  return apiRequest("/api/employees", { method: "GET" });
}