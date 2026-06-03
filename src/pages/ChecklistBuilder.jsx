import { BadgeCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Stepper from "../components/ui/Stepper";

import MaterialsSection from "../features/checklistBuilder/components/MaterialsSection";
import ModeCards from "../features/checklistBuilder/components/ModeCards";
import TasksEditorSection from "../features/checklistBuilder/components/TasksEditorSection";

import { useChecklistBuilderProgram } from "../features/checklistBuilder/hooks/useChecklistBuilderProgram";
import { useChecklistGenerator } from "../features/checklistBuilder/hooks/useChecklistGenerator.js";
import { saveChecklistTemplate } from "../services/aiChecklist.js";

const programSteps = [
  { label: "Detaljer" },
  { label: "Material" },
  { label: "Checklista" },
  { label: "Klar" },
];

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
    navigate(`/programs/${id}/builders`);
  }

  async function handleSaveChecklist(selectedTasks) {
    const result = await saveChecklistTemplate(id, {
      checklistTitle: checklistTitle || program?.name || "Checklista",
      items: selectedTasks,
    });

    if (result.success) {
      navigate(`/programs/${id}/builders`);
    }

    return result;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-10 space-y-8">
        <Stepper steps={programSteps} currentStep={2} />

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
            Checklistbyggare
          </h1>

          {loadingProgram ? (
            <p className="text-sm sm:text-base text-slate-500">
              Hämtar program…
            </p>
          ) : programError ? (
            <p className="text-sm sm:text-base text-red-600">{programError}</p>
          ) : (
            <>
              <p className="text-sm sm:text-base text-slate-500">
                Program:{" "}
                <span className="font-semibold text-slate-700">
                  {program?.name}
                </span>
              </p>

              <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-500">
                Generera, redigera och spara en checklista baserad på uppladdat
                material.
              </p>
            </>
          )}
        </div>
      </div>

      <aside className="border border-slate-200 rounded-lg px-4 py-3 bg-white">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <BadgeCheck className="h-5 w-5" />
          Klart!
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Programmet har en checklista kopplad.
        </p>
      </aside>

      <MaterialsSection
        programId={id}
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
