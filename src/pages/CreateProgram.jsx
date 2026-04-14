import { useNavigate } from "react-router-dom";

import CreateProgramHeader from "../features/createProgram/components/CreateProgramHeader";
import ProgramDetailsCard from "../features/createProgram/components/ProgramDetailsCard";
import UploadMaterialModal from "../features/createProgram/components/UploadMaterialModal";

import { useCreateProgramForm } from "../features/createProgram/hooks/useCreateProgramForm";
import { useModal } from "../features/createProgram/hooks/useModal";
import { useFilePicker } from "../features/createProgram/hooks/useFilePicker";
import { useCreateProgramActions } from "../features/createProgram/hooks/useCreateProgramActions";

export default function CreateProgram() {
  const navigate = useNavigate();

  const {
    unitSuggestions,
    roleSuggestions,
    title,
    unit,
    role,
    description,
    responsible,
    setTitle,
    setUnit,
    setRole,
    setDescription,
    setResponsible,
    buildPayload,
  } = useCreateProgramForm();

  const units = unitSuggestions;
  const roles = roleSuggestions;

  const uploadModal = useModal();
  const filePicker = useFilePicker();
  const actions = useCreateProgramActions();

  function openUploadModal() {
    actions.setUploadError("");
    uploadModal.open();
  }

  function closeUploadModal() {
    if (actions.saving) return;
    uploadModal.close();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">
      <CreateProgramHeader />

      <div className="mt-8">
        <ProgramDetailsCard
          units={units}
          roles={roles}
          title={title}
          unit={unit}
          role={role}
          description={description}
          responsible={responsible}
          setTitle={setTitle}
          setUnit={setUnit}
          setRole={setRole}
          setDescription={setDescription}
          setResponsible={setResponsible}
          saving={actions.saving}
          error={actions.error}
          onOpenUploadModal={openUploadModal}
          onCreateProgram={() =>
            actions.handleCreateAndGoToMaterial({
              navigate,
              title,
              buildPayload,
            })
          }
        />
      </div>

      <UploadMaterialModal
        isOpen={uploadModal.isOpen}
        onClose={closeUploadModal}
        saving={actions.saving}
        uploadError={actions.uploadError}
        onUploadAndContinue={() =>
          actions.handleUploadAndContinue({
            navigate,
            title,
            buildPayload,
            selectedFiles: filePicker.selectedFiles,
            closeModal: uploadModal.close,
          })
        }
        fileInputRef={filePicker.fileInputRef}
        onChooseFilesClick={filePicker.onChooseFilesClick}
        onFilesSelected={(e) => {
          actions.setUploadError("");
          filePicker.onFilesSelected(e);
        }}
        selectedFiles={filePicker.selectedFiles}
        onRemoveSelectedFile={filePicker.removeSelectedFile}
      />
    </div>
  );
}
