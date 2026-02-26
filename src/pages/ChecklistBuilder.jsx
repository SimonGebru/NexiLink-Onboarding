import { BadgeCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import MaterialsSection from "../features/checklistBuilder/components/MaterialsSection";
import ModeCards from "../features/checklistBuilder/components/ModeCards";
import TasksEditorSection from "../features/checklistBuilder/components/TasksEditorSection";

import { useChecklistBuilderProgram } from "../features/checklistBuilder/hooks/useChecklistBuilderProgram";
import { useChecklistGenerator } from "../features/checklistBuilder/hooks/useChecklistGenerator.js";
import { saveChecklistTemplate } from "../services/aiChecklist.js";

export default function ChecklistBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    program,
    loadingProgram,
    programError,

    aiMaterials,

    selectedMaterialIndex,
    inputText,

    selectedMaterialIds,
    setSelectedMaterialIds,

    handleSelectMaterial,
  } = useChecklistBuilderProgram(id);

  const {
    selectedMode,
    aiLoading,
    aiError,
    checklistTitle,
    tasks,

    mode3InputType,
    setMode3InputType,
    mode3Hint,

    resetAiState,
    handleToggleMaterialId,
    callGenerateChecklist,
  } = useChecklistGenerator({
    programId: id,
    aiMaterials,
    inputText,
    selectedMaterialIds,
    setSelectedMaterialIds,
  });

  function handleCancel() {
    navigate(`/programs/${id}/material`);
  }

  async function handleSaveChecklist() {
   const result = await saveChecklistTemplate(id, {
      checklistTitle,
      items: tasks,
    });
    
    if (result.success) {
      navigate("/onboarding/assign");
    }
    
    return result;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-10 space-y-1">
        <h1 className="font-bold text-2xl">Checklistbyggare</h1>

        {loadingProgram ? (
          <p className="text-sm text-gray-500">Hämtar program…</p>
        ) : programError ? (
          <p className="text-sm text-red-600">{programError}</p>
        ) : (
          <p className="text-sm text-gray-600">
            Program: <span className="font-semibold">{program?.name}</span>
          </p>
        )}
      </header>

      {/* Confirmation */}
      <aside className="border-2 border-gray-200 px-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mt-2">
          <BadgeCheck /> Klart!
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Programmet har en checklista kopplad.
        </p>
      </aside>

      <MaterialsSection
        aiMaterials={aiMaterials}
        selectedMaterialIds={selectedMaterialIds}
        handleToggleMaterialId={handleToggleMaterialId}
        selectedMaterialIndex={selectedMaterialIndex}
        onSelectMaterial={(e) => handleSelectMaterial(e, resetAiState)}
        mode3InputType={mode3InputType}
        setMode3InputType={setMode3InputType}
        mode3Hint={mode3Hint}
        inputText={inputText}
      />

      <ModeCards
        aiLoading={aiLoading}
        selectedMode={selectedMode}
        disabled={aiLoading || aiMaterials.length === 0}
        onSelectMode={callGenerateChecklist}
      />

      <TasksEditorSection
        aiError={aiError}
        aiLoading={aiLoading}
        checklistTitle={checklistTitle}
        tasks={tasks}
        onCancel={handleCancel}
        onSaveChecklist={handleSaveChecklist}
      />
    </div>
  );
}
