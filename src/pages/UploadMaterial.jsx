import { useEffect, useRef, useState } from "react";
import {
  CloudUpload,
  FileText,
  Link as LinkIcon,
  Trash2,
  File,
  Upload,
  Loader2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";

// Enkel upload-helper här i filen (så slipper du skapa service direkt).
// Sen kan vi flytta detta till programService när du vill.
async function uploadProgramMaterials(programId, files) {
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

export default function UploadMaterial() {
  const { id } = useParams(); // programId från URL
  const navigate = useNavigate();

  
  const [program, setProgram] = useState(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState("");

  
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  
  async function loadProgram() {
    setLoadingProgram(true);
    setProgramError("");

    try {
      const data = await apiRequest(`/api/programs/${id}`, { method: "GET" });
      setProgram(data);
    } catch (err) {
      setProgramError(err?.message || "Kunde inte hämta programmet.");
    } finally {
      setLoadingProgram(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setProgramError("Saknar program-ID i URL.");
      setLoadingProgram(false);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoadingProgram(true);
        setProgramError("");
        const data = await apiRequest(`/api/programs/${id}`, { method: "GET" });
        if (!alive) return;
        setProgram(data);
      } catch (err) {
        if (!alive) return;
        setProgramError(err?.message || "Kunde inte hämta programmet.");
      } finally {
        if (!alive) return;
        setLoadingProgram(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  function handleCancel() {
    navigate("/onboarding");
  }

  function onChooseFilesClick() {
    fileInputRef.current?.click();
  }

  function onFilesSelected(e) {
    setUploadError("");
    setUploadSuccess("");

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const next = [...prev];
      for (const f of files) {
        const key = `${f.name}-${f.size}`;
        if (!existing.has(key)) next.push(f);
      }
      return next;
    });

    e.target.value = "";
  }

  function removeSelectedFile(index) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUploadSelectedFiles() {
    setUploadError("");
    setUploadSuccess("");

    if (!id) {
      setUploadError("Saknar program-ID.");
      return;
    }

    if (selectedFiles.length === 0) {
      setUploadError("Välj minst en fil att ladda upp.");
      return;
    }

    try {
      setUploading(true);

      await uploadProgramMaterials(id, selectedFiles);

      setSelectedFiles([]);
      setUploadSuccess("Filer uppladdade! ✅");

      // refresha så tabellen får riktiga materials
      await loadProgram();
    } catch (err) {
      setUploadError(err?.message || "Kunde inte ladda upp filer.");
    } finally {
      setUploading(false);
    }
  }

  // Material från backend
  const materials = program?.materials || [];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Uppladdning av material
        </h1>

        {/* Program-info */}
        {loadingProgram ? (
          <p className="text-gray-500">Hämtar program…</p>
        ) : programError ? (
          <p className="text-red-600">{programError}</p>
        ) : (
          <div className="space-y-1">
            <p className="text-gray-700">
              Program: <span className="font-semibold">{program?.name}</span>
            </p>
            {program?.description ? (
              <p className="text-gray-500">{program.description}</p>
            ) : (
              <p className="text-gray-500">
                Ladda upp och hantera filer samt länkar för ditt onboardingprogram.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Upload sektion */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Lägg till nya material
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Välj filer och ladda upp dem till programmet.
        </p>

        {/* Feedback */}
        {uploadError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {uploadError}
          </div>
        ) : null}

        {uploadSuccess ? (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {uploadSuccess}
          </div>
        ) : null}

        
        <button
          type="button"
          onClick={onChooseFilesClick}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-50 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center text-center group"
        >
          <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform">
            <CloudUpload className="text-gray-400 w-8 h-8" />
          </div>
          <span className="block text-gray-900 font-medium mb-1">
            Klicka för att välja filer
          </span>
          <span className="text-sm text-gray-400">
            PDF, DOCX, XLSX, bilder (enligt backend)
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onFilesSelected}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
        />

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onChooseFilesClick}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileText size={16} />
              Välj filer
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors"
              onClick={() => alert("Lägg till länk kommer när vi har backend för länkar")}
            >
              <LinkIcon size={16} />
              Lägg till länk
            </button>
          </div>

          <button
            type="button"
            onClick={handleUploadSelectedFiles}
            disabled={uploading || selectedFiles.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={
              selectedFiles.length === 0
                ? "Välj filer först"
                : "Ladda upp valda filer"
            }
          >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            {uploading ? "Laddar upp..." : `Ladda upp (${selectedFiles.length})`}
          </button>
        </div>

        {/* Valda filer lista */}
        {selectedFiles.length > 0 ? (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Valda filer</p>
              <p className="text-xs text-gray-500">{selectedFiles.length} st</p>
            </div>

            <div className="p-4">
              <ul className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <li
                    key={`${file.name}-${file.size}-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                    >
                      Ta bort
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>

      {/* Table */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Uppladdade material
        </h3>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-semibold text-gray-600">Fil/Länk</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Titel</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Typ</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Taggar</th>
                <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                  Obligatorisk
                </th>
                <th className="px-5 py-3 font-semibold text-gray-600 text-center">
                  Åtgärder
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {materials.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-gray-500" colSpan={6}>
                    Inget material uppladdat ännu.
                  </td>
                </tr>
              ) : (
                materials.map((item, index) => {
                  const isLink = item?.type === "link";
                  const displayName = isLink ? item?.url : item?.fileName;

                  return (
                    <tr
                      key={item?._id || `${displayName}-${index}`}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      {/* Fil/Länk */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {isLink ? (
                            <LinkIcon size={18} className="text-gray-400 flex-shrink-0" />
                          ) : (
                            <File size={18} className="text-gray-400 flex-shrink-0" />
                          )}
                          <span
                            className="text-gray-700 truncate max-w-[220px]"
                            title={displayName}
                          >
                            {displayName}
                          </span>
                        </div>
                      </td>

                      {/* Titel */}
                      <td className="px-5 py-3">
                        <span className="text-gray-700">
                          {item?.title || (isLink ? "Länk" : "Fil")}
                        </span>
                      </td>

                      {/* Typ */}
                      <td className="px-5 py-3">
                        <span className="text-gray-600">
                          {isLink ? "Länk" : "Fil"}
                        </span>
                      </td>

                      {/* Taggar */}
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {(item?.tags || []).length === 0 ? (
                            <span className="text-xs text-gray-400">—</span>
                          ) : (
                            item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600"
                              >
                                {tag}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Obligatorisk */}
                      <td className="px-5 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(item?.required)}
                          readOnly
                          className="w-4 h-4 text-gray-900 border-gray-300 rounded accent-gray-900"
                          title="Vi kopplar detta när vi har PATCH för material"
                        />
                      </td>

                      {/* Åtgärder */}
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          className="p-1.5 text-gray-300 cursor-not-allowed rounded-md"
                          title="Delete kommer när vi har backend-endpoint för att ta bort material"
                          disabled
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer btns */}
      <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Avbryt
        </button>

        <Link to={`/programs/${id}/checklist`}>
          <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
            Fortsätt till checklistbyggaren
          </button>
        </Link>
      </div>
    </div>
  );
}
