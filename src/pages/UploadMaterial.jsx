import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProgramHeader from "../features/uploadMaterial/components/ProgramHeader";
import UploadSection from "../features/uploadMaterial/components/UploadSection";
import MaterialsTable from "../features/uploadMaterial/components/MaterialsTable";
import FooterActions from "../features/uploadMaterial/components/FooterActions";

import { useProgramMaterials } from "../features/uploadMaterial/hooks/useProgramMaterials";
import { useFilePicker } from "../features/uploadMaterial/hooks/useFilePicker";
import { uploadProgramMaterials } from "../features/uploadMaterial/services/uploadProgramMaterials";

export default function UploadMaterial() {
  const { id } = useParams(); // programId från URL
  const navigate = useNavigate();

  const { program, loadingProgram, programError, materials, loadProgram } =
    useProgramMaterials(id);

  const {
    fileInputRef,
    selectedFiles,
    onChooseFilesClick,
    onFilesSelected,
    removeSelectedFile,
    clearSelectedFiles,
  } = useFilePicker();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  function handleCancel() {
    navigate("/onboarding");
  }

  function resetUploadFeedback() {
    setUploadError("");
    setUploadSuccess("");
  }

  async function handleUploadSelectedFiles() {
    resetUploadFeedback();

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

      clearSelectedFiles();
      setUploadSuccess("Filer uppladdade! ✅");

      // refresha så tabellen får riktiga materials
      await loadProgram();
    } catch (err) {
      setUploadError(err?.message || "Kunde inte ladda upp filer.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <ProgramHeader
        loadingProgram={loadingProgram}
        programError={programError}
        program={program}
      />

      <UploadSection
        fileInputRef={fileInputRef}
        onChooseFilesClick={onChooseFilesClick}
        onFilesSelected={(e) =>
          onFilesSelected(e, { onResetFeedback: resetUploadFeedback })
        }
        uploading={uploading}
        selectedFiles={selectedFiles}
        onUpload={handleUploadSelectedFiles}
        uploadError={uploadError}
        uploadSuccess={uploadSuccess}
        onRemoveSelectedFile={removeSelectedFile}
      />

      <MaterialsTable materials={materials} />

      <FooterActions programId={id} onCancel={handleCancel} />
    </div>
  );
}
