import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HelpCircle,
  BrainCircuit,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Stepper from "../components/ui/Stepper";
import { useChecklistBuilderProgram } from "../features/checklistBuilder/hooks/useChecklistBuilderProgram";
import { generateProgramQuiz } from "../services/aiQuiz";

const programSteps = [
  { label: "Detaljer" },
  { label: "Material" },
  { label: "Checklista/Quiz" },
  { label: "Klar" },
];

export default function QuizBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    program,
    loadingProgram,
    programError,
    aiMaterials,
    selectedMaterialIds,
    setSelectedMaterialIds,
  } = useChecklistBuilderProgram(id);

  const [questionCount, setQuestionCount] = useState("");
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // Hantera checkboxar
  function handleToggleMaterialId(materialId) {
    const idStr = String(materialId);
    setSelectedMaterialIds((prev) => {
      if (prev.includes(idStr)) {
        return prev.filter((i) => i !== idStr);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, idStr];
    });
  }

  async function handleGenerateQuiz(force = false) {
    if (selectedMaterialIds.length === 0) {
      setQuizError("Du måste välja minst ett dokument.");
      return;
    }

    setLoadingQuiz(true);
    setQuizError("");
    try {
      const res = await generateProgramQuiz(id, {
        materialIds: selectedMaterialIds,
        questionCount: Number(questionCount),
        language: "sv",
        force,
      });

      if (res.ok && res.quiz) {
        setGeneratedQuiz(res.quiz);
      } else {
        setQuizError(res.error || "Kunde inte generera quizet.");
      }
    } catch (err) {
      setQuizError(err.message || "Ett fel uppstod vid generering.");
    } finally {
      setLoadingQuiz(false);
    }
  }

  function handleSaveAndContinue() {
    navigate(`/programs/${id}/builders`);
  }

  if (loadingProgram) {
    return (
      <div className="p-8 text-center text-slate-500">Laddar program..</div>
    );
  }

  if (programError) {
    return <div className="p-8 text-center text-red-500">{programError}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-10 space-y-8">
        <Stepper steps={programSteps} currentStep={2} />

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 flex items-center justify-center gap-3">
            <HelpCircle className="text-blue-600" size={36} />
            Quiz
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Generera quiz baserat på uppladdat material.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vänster */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border text-left border-slate-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Konfiguration
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Antal frågor (3-15)
              </label>
              <input
                type="number"
                min="3"
                max="15"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Material
              </label>

              {aiMaterials.length === 0 ? (
                <p className="text-sm text-red-500">
                  Inga filer hittades. Gå tillbaka och ladda upp.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {aiMaterials.map((m) => {
                    const idStr = String(m._id);
                    const checked = selectedMaterialIds.includes(idStr);
                    return (
                      <label
                        key={idStr}
                        className="flex flex-start items-center gap-3 text-sm text-slate-600 p-2 border border-slate-100 rounded hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleMaterialId(m._id)}
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate flex-1">
                          {m.title || m.fileName || "Uppladdad fil"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              <div className="mt-2 text-xs text-slate-500 text-right">
                Valda: {selectedMaterialIds.length}/5 (Max 5 dokument)
              </div>
            </div>

            {quizError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {quizError}
              </div>
            )}

            <button
              onClick={() => handleGenerateQuiz(false)}
              disabled={loadingQuiz || aiMaterials.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loadingQuiz ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Genererar...
                </>
              ) : (
                <>
                  <BrainCircuit size={18} />
                  Generera Quiz
                </>
              )}
            </button>
          </div>
        </div>

        {/* Höger */}
        <div className="lg:col-span-2">
          {!generatedQuiz && !loadingQuiz && (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <HelpCircle className="text-slate-300 mb-4" size={48} />
              <p className="text-slate-500">
                Klicka på Generera Quiz för att låta AI
                skapa frågor.
              </p>
            </div>
          )}

          {loadingQuiz && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <BrainCircuit
                className="text-blue-500 mb-4 animate-pulse"
                size={48}
              />
              <p className="text-slate-600 font-medium">
                Läser dokument och skapar ett quiz
              </p>
            </div>
          )}

          {generatedQuiz && !loadingQuiz && (
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-blue-50/50 p-6 text-left border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {generatedQuiz.quiz?.title || "Genererat Quiz"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {generatedQuiz.quiz?.description}
                  </p>
                </div>
                <button
                  onClick={() => handleGenerateQuiz(true)}
                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw size={16} /> Skapa nytt
                </button>
              </div>

              <div className="p-6 space-y-6 text-left">
                {generatedQuiz.quiz?.questions?.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-sm transition text-left"
                  >
                    <div className="flex gap-3 mb-4">
                      <div className="font-bold text-slate-400">
                        Q{idx + 1}.
                      </div>
                      <div className="font-medium text-slate-800">
                        {q.question}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8 text-left">
                      {q.options?.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg text-sm border font-medium flex items-center gap-2 ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                          >
                            {isCorrect && (
                              <CheckCircle2
                                size={16}
                                className="text-emerald-500"
                              />
                            )}
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-4 pl-8">
                        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          Förklaring: {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-200 pt-6 mt-12">
        <button
          onClick={() => navigate(`/programs/${id}/builders`)}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Tillbaka
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Klar, gå tillbaka
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
