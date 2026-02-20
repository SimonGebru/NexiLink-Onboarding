const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem("token");

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  
  if (!isFormData && options.body != null) {
    // Om body redan är en string (JSON.stringify) är det JSON
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Försök läsa JSON om det finns
  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;

    throw new Error(message);
  }

  return data;
}