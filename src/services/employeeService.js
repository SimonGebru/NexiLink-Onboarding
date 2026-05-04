import { apiRequest } from "./api";

export function fetchEmployees() {
  return apiRequest("/api/employees", { method: "GET" });
}

export function fetchEmployeeById(id) {
  return apiRequest(`/api/employees/${id}`, { method: "GET" });
}

export function createEmployee(payload) {
  return apiRequest("/api/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEmployee(id, payload) {
  return apiRequest(`/api/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteEmployee(id) {
  return apiRequest(`/api/employees/${id}`, { method: "DELETE" });
}

export function createEmployeeInvite(employeeId, email) {
  return apiRequest("/api/invites/employee", {
    method: "POST",
    body: JSON.stringify({ employeeId, email }),
  });
}
