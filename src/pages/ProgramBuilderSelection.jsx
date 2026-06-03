import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckSquare, HelpCircle, ArrowRight } from "lucide-react";
import Stepper from "../components/ui/Stepper";
import { apiRequest } from "../services/api";

const programSteps = [
  { label: "Detaljer" },
  { label: "Material" },
  { label: "Checklista/Quiz" },
  { label: "Klar" },
];

export default function ProgramBuilderSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [hasChecklist, setHasChecklist] = useState(false);
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        // Hämta program för att kolla checklista
        const progRes = await apiRequest(`/api/programs/${id}`);
        if (progRes.ok && progRes.program) {
          setHasChecklist(
            progRes.program.checklistTemplate &&
              progRes.program.checklistTemplate.length > 0,
          );
        }

        // Kolla om det finns ett färdigt quiz
        const quizRes = await apiRequest(`/api/programs/${id}/quiz`);
        if (quizRes.ok && quizRes.quiz) {
          setHasQuiz(true);
        }
      } catch (error) {
        console.error("Fel vid hämtning av status", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [id]);

  function handleContinue() {
    navigate("/onboarding/assign");
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-10 space-y-8">
        <Stepper steps={programSteps} currentStep={2} />

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
            Skapa Innehåll
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Skapa en checklista, ett quiz eller båda delarna
            för detta program.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Checklista Kort */}
        <div
          onClick={() => navigate(`/programs/${id}/checklist`)}
          className="bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all rounded-2xl p-8 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <CheckSquare size={30} />
            </div>
            {hasChecklist && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                Skapad
              </span>
            )}
          </div>
         
          <p className="text-slate-500 mb-4">
            Generera en strukturerad checklista baserad på materialet.
          </p>
          <div className="flex items-center text-emerald-600 font-medium group-hover:gap-2 transition-all">
            <span>Bygg checklista</span>
            <ArrowRight size={18} className="ml-1" />
          </div>
        </div>

        {/* Quiz Kort */}
        <div
          onClick={() => navigate(`/programs/${id}/quiz`)}
          className="bg-white border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all rounded-2xl p-8 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
              <HelpCircle size={30} />
            </div>
            {hasQuiz && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                Skapat
              </span>
            )}
          </div>
          <p className="text-slate-500 mb-4">
            Generera ett interaktivt quiz för att testa kunskaper.
          </p>
          <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
            <span>Bygg quiz</span>
            <ArrowRight size={18} className="ml-1" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-200 pt-6">
        <button
          onClick={() => navigate(`/programs/${id}/material`)}
          className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
        >
          Tillbaka
        </button>
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <span>Fortsätt</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
