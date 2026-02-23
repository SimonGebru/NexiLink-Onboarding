import { useState } from "react";
import { createProgram, uploadProgramMaterials } from "../../../services/programService";

export function useCreateProgramActions() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [createdProgramId, setCreatedProgramId] = useState(null);

  const [uploadError, setUploadError] = useState("");

  async function handleCreateProgram({ title, buildPayload }) {
    setError("");

    if (!title.trim()) {
      setError("Programnamn måste fyllas i.");
      return null;
    }

    try {
      setSaving(true);

      const payload = buildPayload();
      const created = await createProgram(payload);

      const id = created?._id;
      if (!id) throw new Error("Backend returnerade inget program-ID.");

      setCreatedProgramId(id);
      return id;
    } catch (err) {
      const msg = err?.message || "Kunde inte skapa program.";

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

  async function handleCreateAndGoToMaterial({ navigate, title, buildPayload }) {
    const id = createdProgramId || (await handleCreateProgram({ title, buildPayload }));
    if (!id) return;

    navigate(`/programs/${id}/material`);
  }

  async function handleUploadAndContinue({
    navigate,
    title,
    buildPayload,
    selectedFiles,
    closeModal,
  }) {
    setUploadError("");

    const id = createdProgramId || (await handleCreateProgram({ title, buildPayload }));
    if (!id) return;

    try {
      setSaving(true);

      if (selectedFiles.length > 0) {
        await uploadProgramMaterials(id, selectedFiles);
      }

      closeModal();
      navigate(`/programs/${id}/material`);
    } catch (err) {
      setUploadError(err?.message || "Kunde inte ladda upp filer.");
    } finally {
      setSaving(false);
    }
  }

  return {
    saving,
    error,
    setError,

    createdProgramId,

    uploadError,
    setUploadError,

    handleCreateProgram,
    handleCreateAndGoToMaterial,
    handleUploadAndContinue,
  };
}