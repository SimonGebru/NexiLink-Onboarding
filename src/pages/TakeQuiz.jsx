import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { getOnboardingQuiz, submitQuizAnswer } from "../services/meService";

export default function TakeQuiz() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);
        const data = await getOnboardingQuiz(id);
        setQuiz(data);
      } catch (err) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [id]);

  const handleSelectAnswer = async (questionIndex, optionIndex) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.questions) {
      setError("Kunde inte hitta quizet. Uppdatera sidan och försök igen.");
      return;
    }

    if (Object.keys(answers).length < quiz.questions.length) {
      setError("Vänligen besvara alla frågor innan du lämnar in.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const answersArray = quiz.questions.map((_, i) => ({
        questionIndex: i,
        selectedAnswer: answers[i],
      }));

      const response = await submitQuizAnswer(id, answersArray);

      if (response && response.attempt) {
        setResult({
          score: response.attempt.score,
          total: response.attempt.totalQuestions,
          passed: response.attempt.passed,
        });
      } else {
        setResult(response);
      }
    } catch (err) {
      setError(err.message || "Ett fel uppstod när quizzet skulle skickas in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Laddar quiz..</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <Link
          to={`/my/onboarding/${id}`}
          className="inline-flex items-center gap-2 text-sm text-[#1A4D4F] hover:underline font-medium mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Quiz
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Quiz</h1>
        <p className="text-slate-500 mt-1">
          {result
            ? "Här ser du dina svar och förklaringar."
            : "Läs frågorna noggrant."}
        </p>
      </div>

      {result && (
        <Card
          className={`border-l-4 ${result.passed ? "border-emerald-500 bg-emerald-50/50" : "border-red-500 bg-red-50/50"}`}
        >
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              {result.passed ? (
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : (
                <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Quiz slutfört!
                </h2>
                <p className="text-slate-600 text-sm mt-0.5">
                  Du fick{" "}
                  <span className="font-semibold text-slate-900">
                    {result.score} av {result.total} rätt
                  </span>
                  .
                </p>
              </div>
            </div>
            <Link
              to={`/my/onboarding/${id}`}
              className="w-full sm:w-auto text-center inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Tillbaka till onboarding
            </Link>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {quiz?.questions?.map((q, qIndex) => (
          <Card key={qIndex} className="border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4">
              <h3 className="font-semibold text-slate-900 text-[15px]">
                {q.question}
              </h3>
            </div>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="space-y-3">
                {q.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  const isCorrectAnswer = q.correctAnswer === oIndex;

                  let buttonStyle =
                    "border-slate-200 text-slate-700 hover:border-[#1A4D4F] hover:bg-slate-50";
                  let circleStyle = "border-slate-300";

                  if (result) {
                    if (isCorrectAnswer) {
                      buttonStyle =
                        "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 font-medium";
                      circleStyle = "border-emerald-500 bg-emerald-500";
                    } else if (isSelected) {
                      buttonStyle =
                        "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500";
                      circleStyle = "border-red-500 bg-red-500";
                    } else {
                      buttonStyle =
                        "border-slate-200 text-slate-400 opacity-60 cursor-not-allowed";
                      circleStyle = "border-slate-200";
                    }
                  } else if (isSelected) {
                    buttonStyle =
                      "border-[#1A4D4F] bg-[#1A4D4F]/5 text-[#1A4D4F] ring-1 ring-[#1A4D4F]";
                    circleStyle = "border-[#1A4D4F] bg-[#1A4D4F]";
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleSelectAnswer(qIndex, oIndex)}
                      disabled={!!result}
                      className={`w-full flex items-center p-4 rounded-lg border text-left transition-all ${buttonStyle}`}
                    >
                      <div
                        className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border flex-shrink-0 ${circleStyle}`}
                      >
                        {isSelected && !result && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                        {result && (isCorrectAnswer || isSelected) && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm">{option}</span>
                    </button>
                  );
                })}
              </div>

              {result && q.explanation && (
                <div className="mt-4 p-4 rounded-lg bg-slate-50 border-l-4 border-[#1A4D4F] text-sm text-slate-600">
                  <span className="font-semibold text-slate-900 block mb-1">
                    Förklaring:
                  </span>
                  {q.explanation}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!result && (
        <div className="flex justify-end pt-4 pb-12">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#1A4D4F] px-8 text-base font-medium text-white hover:bg-[#1A4D4F]/90 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Skickar in ditt svar.." : "Lämna in svar"}
          </button>
        </div>
      )}
    </div>
  );
}
