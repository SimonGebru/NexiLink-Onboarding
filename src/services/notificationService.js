import { apiRequest } from "./api";

// Backend: GET /api/notifications -> { unreadCount, items }
export async function fetchNotifications({ limit = 20, unreadOnly = false } = {}) {
  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  if (unreadOnly) qs.set("unreadOnly", "true");

  return apiRequest(`/api/notifications?${qs.toString()}`, { method: "GET" });
}

export async function markNotificationRead(id) {
  return apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" });
}

// Backend: PATCH /api/notifications/read-all
export async function markAllNotificationsRead() {
  return apiRequest("/api/notifications/read-all", { method: "PATCH" });
}