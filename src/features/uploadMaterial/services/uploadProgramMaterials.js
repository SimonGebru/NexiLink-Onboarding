// Flyttad hit för att hålla UploadMaterial.jsx ren.

export async function uploadProgramMaterials(programId, files) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const url = `${API_BASE_URL}/api/programs/${programId}/materials`;

  const token = localStorage.getItem("token");

  const formData = new FormData();
  for (const file of files) formData.append("files", file);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `Upload failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}