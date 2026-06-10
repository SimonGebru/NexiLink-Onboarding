import { useParams } from "react-router-dom";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import ProgressBar from "../features/onboardingDetails/components/ProgressBar";
import TaskRow from "../features/onboardingDetails/components/TaskRow";
import { useOnboardingDetails } from "../features/onboardingDetails/hooks/useOnboardingDetails";

export default function OnboardingDetails() {
  const { id } = useParams();

  const {
    onboarding,
    progress,
    tasksSorted,
    quizAttempts,
    loading,
    error,
    handlePatched,
  } = useOnboardingDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        Laddar onboarding...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!onboarding) return null;

  const employeeName = onboarding.employee?.fullName || "—";
  const programName = onboarding.program?.name || "—";
  const assignedQuiz = onboarding.assignedQuiz || null;
  const quizQuestions = assignedQuiz?.quiz?.questions || [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Onboarding: {employeeName}
        </h1>

        <p className="text-slate-500">
          Program:{" "}
          <span className="font-medium text-slate-700">{programName}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>

          <CardDescription>
            {progress.done}/{progress.total} klara ({progress.percent}%)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProgressBar value={progress.percent} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <HelpCircle className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>Quiz</CardTitle>

              <CardDescription>
                Quiz som är kopplat till denna onboarding.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {assignedQuiz ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">
                  {assignedQuiz.quiz?.title || "Quiz"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {assignedQuiz.quiz?.description ||
                    "Ingen beskrivning angiven."}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {quizQuestions.length} frågor
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {assignedQuiz.status === "done"
                      ? "Genererat"
                      : assignedQuiz.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {quizQuestions.map((question, index) => (
                  <div
                    key={`${question.question}-${index}`}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Fråga {index + 1}
                        </p>

                        <h4 className="mt-1 font-semibold text-slate-900">
                          {question.question}
                        </h4>
                      </div>

                      {question.difficulty ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {question.difficulty}
                        </span>
                      ) : null}
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      {(question.options || []).map((option, optionIndex) => {
                        const isCorrect =
                          optionIndex === question.correctAnswer;

                        return (
                          <div
                            key={`${option}-${optionIndex}`}
                            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                              isCorrect
                                ? "border-green-200 bg-green-50 text-green-800"
                                : "border-slate-200 bg-slate-50 text-slate-600"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                            ) : (
                              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                            )}

                            <span>{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation ? (
                      <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        <span className="font-semibold">Förklaring:</span>{" "}
                        {question.explanation}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Inget quiz är tilldelat denna onboarding.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quizresultat</CardTitle>

          <CardDescription>
            Resultat från genomförda quizförsök.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {quizAttempts?.length > 0 ? (
            <div className="space-y-4">
              {quizAttempts.map((attempt, index) => (
                <div
                  key={attempt._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Försök {index + 1}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {attempt.completedAt
  ? new Date(attempt.completedAt).toLocaleString("sv-SE")
  : "Okänt datum"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        {attempt.score}/{attempt.totalQuestions}
                      </p>

                      <p className="text-sm text-slate-500">
                        {attempt.percent}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {attempt.passed ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Godkänd
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        Ej godkänd
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Den anställde har inte genomfört något quiz ännu.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasksSorted.map((task) => (
          <TaskRow
            key={task._id}
            task={task}
            onboardingId={onboarding._id}
            onPatched={handlePatched}
          />
        ))}
      </div>
    </div>
  );
}