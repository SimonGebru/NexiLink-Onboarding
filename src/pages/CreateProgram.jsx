import { useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FormField, Input, Select, Textarea } from "../components/ui/Form";

import { CloudUpload, FileText, Link as LinkIcon, X } from "lucide-react";

import { createProgram } from "../services/programService";

export default function CreateProgram() {
  const navigate = useNavigate();

  const units = useMemo(
    () => [
      "Individ- och familjeomsorg",
      "Barn och unga",
      "Missbruk och beroende",
      "Äldreomsorg",
      "Funktionsstöd",
      "Arbetsmarknad och integration",
      "Socialpsykiatri",
    ],
    []
  );

  const roles = useMemo(
    () => [
      "Socionom",
      "Socialsekreterare",
      "Kurator",
      "Behandlare",
      "Biståndshandläggare",
      "Familjebehandlare",
      "Enhetschef",
    ],
    []
  );

  // ===== FORM STATE (NYTT) =====
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");

  // Feedback state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // När vi väl skapat programmet vill vi komma ihåg id:t
  const [createdProgramId, setCreatedProgramId] = useState(null);

  // ===== MODAL STATE (som du hade) =====
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  function openUploadModal() {
    setIsUploadOpen(true);
  }

  function closeUploadModal() {
    setIsUploadOpen(false);
  }

  function onChooseFilesClick() {
    fileInputRef.current?.click();
  }

  function onFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => {
      const existingKey = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const next = [...prev];
      for (const f of files) {
        const key = `${f.name}-${f.size}`;
        if (!existingKey.has(key)) next.push(f);
      }
      return next;
    });

    e.target.value = "";
  }

  function removeSelectedFile(index) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // ===== NYTT: skapar program i backend =====
  async function handleCreateProgram() {
    setError("");

    if (!title.trim()) {
      setError("Programnamn måste fyllas i.");
      return null;
    }

    try {
      setSaving(true);

      // Payload: skicka bara det som finns
      const payload = {
  name: title.trim(),
  unit: unit || undefined,
  role: role || undefined,
  description: description.trim() || undefined,
  responsible: responsible.trim() || undefined,
};

      const created = await createProgram(payload);

      // Förväntar oss Mongo: created._id
      const id = created?._id;
      if (!id) {
        throw new Error("Backend returnerade inget program-ID.");
      }

      setCreatedProgramId(id);
      return id;
    } catch (err) {
      const msg = err?.message || "Kunde inte skapa program.";

      // extra tydligt om du inte är admin
      if (msg.toLowerCase().includes("forbidden") || msg.includes("403")) {
        setError("Endast admin kan skapa program.");
      } else {
        setError(msg);
      }

      return null;
    } finally {
      setSaving(false);
    }
  }

  // Skapa program och gå vidare till material-sidan
  async function handleCreateAndGoToMaterial() {
    const id = createdProgramId || (await handleCreateProgram());
    if (!id) return;

    navigate(`/programs/${id}/material`);
  }

  // Modal-knapp: skapa (om inte skapad) och fortsätt
  async function handleUploadAndContinue() {
    const id = createdProgramId || (await handleCreateProgram());
    if (!id) return;

    // Själva filuppladdningen gör vi senare.
    // Nu: bara gå vidare till material-vyn för programmet.
    navigate(`/programs/${id}/material`);
  }

  return (
    <div className="w-full space-y-10">
      {/* Page header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-slate-700 sm:text-4xl">
          Skapa nytt onboardingprogram
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-500 sm:text-mg">
          Program kan återanvändas för flera nyanställda.
        </p>
      </div>

      {/* Form card */}
      <Card variant="form" className="w-full">
        <CardHeader variant="form">
          <CardTitle className="text-xl sm:text-2xl">Programdetaljer</CardTitle>
          <CardDescription className="text-base">
            Fyll i informationen nedan för att skapa ett nytt onboardingprogram.
          </CardDescription>
        </CardHeader>

        <CardContent variant="form" className="space-y-10">
          {/* Error */}
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {/* Program name */}
          <FormField label="Programnamn">
            <Input
              className="h-12 text-base"
              placeholder="T.ex. Ny anställd i marknadsavdelningen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormField>

          {/* Unit + Role */}
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Enhet">
              <Select
                className="h-12 text-base"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="" disabled>
                  Välj en enhet
                </option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Roll">
              <Select
                className="h-12 text-base"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  Välj en roll
                </option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Beskrivning (valfri)">
            <Textarea
              className="text-base min-h-[200px]"
              rows={6}
              placeholder="Ange en kort beskrivning av programmet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          {/* Responsible */}
          <FormField label="Ansvarig (valfri)">
            <Input
              className="h-12 text-base"
              placeholder="Namn på ansvarig person eller avdelning"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
            />
          </FormField>

          <div className="pt-2 border-t border-slate-100" />

          {/* Upload section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-base font-semibold text-slate-900">
                Ladda upp material
              </div>
              <p className="text-sm sm:text-base text-slate-500">
                Ladda upp filer och länkar direkt här innan du fortsätter.
              </p>
            </div>

            <button
              type="button"
              onClick={openUploadModal}
              className="w-full sm:w-auto h-12 px-7 rounded-xl bg-slate-900 text-white text-base font-medium shadow-sm hover:bg-slate-800 transition-colors"
            >
              Ladda upp material
            </button>
          </div>

          {/* Actions (NYTT) */}
          <div className="pt-2 border-t border-slate-100" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              onClick={handleCreateAndGoToMaterial}
              disabled={saving}
            >
              {saving ? "Skapar..." : "Skapa program"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="h-1" />

      {/* MODAL */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeUploadModal}
          />

          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Ladda upp material
                </h2>
                <p className="text-sm text-slate-500">
                  Lägg till filer och länkar till onboardingprogrammet.
                </p>
              </div>

              <button
                type="button"
                onClick={closeUploadModal}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Stäng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Lägg till nya material
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Dra och släpp filer eller använd knapparna nedan för att ladda upp.
                </p>

                <button
                  type="button"
                  onClick={onChooseFilesClick}
                  className="w-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer p-10 flex flex-col items-center justify-center text-center group"
                >
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform">
                    <CloudUpload className="text-slate-400 w-8 h-8" />
                  </div>
                  <span className="block text-slate-900 font-medium mb-1">
                    Dra och släpp filer här
                  </span>
                  <span className="text-sm text-slate-400">
                    eller klicka för att välja
                  </span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={onFilesSelected}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onChooseFilesClick}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <FileText size={16} />
                      Välj filer
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 bg-white transition-colors"
                      onClick={() => alert("Lägg till länk (kommer sen)")}
                    >
                      <LinkIcon size={16} />
                      Lägg till länk
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">
                    Accepterade filtyper: PDF, DOCX, PPTX och externa länkar.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Valda filer</p>
                  <p className="text-xs text-slate-500">{selectedFiles.length} st</p>
                </div>

                <div className="p-4">
                  {selectedFiles.length === 0 ? (
                    <p className="text-sm text-slate-500">Inga filer valda ännu.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedFiles.map((file, idx) => (
                        <li
                          key={`${file.name}-${file.size}-${idx}`}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeSelectedFile(idx)}
                            className="text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                          >
                            Ta bort
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={closeUploadModal}
                className="h-11 px-5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Avbryt
              </button>

              <button
                type="button"
                onClick={handleUploadAndContinue}
                className="h-11 px-6 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
                title="Skapa program och fortsätt"
              >
                {saving ? "Skapar..." : "Ladda upp och fortsätt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
