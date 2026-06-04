import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  HelpCircle,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FormField, Select, Input } from "../components/ui/Form";

import ProgressBar from "../features/assignOnboarding/components/ProgressBar";
import TaskCard from "../features/assignOnboarding/components/TaskCard";
import EmptyStateBox from "../features/assignOnboarding/components/EmptyStateBox";
import ProgramPreviewList from "../features/assignOnboarding/components/ProgramPreviewList";

import { useAssignOnboarding } from "../features/assignOnboarding/hooks/useAssignOnboarding";
import { useProgramPreview } from "../features/assignOnboarding/hooks/useProgramPreview";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AssignOnboarding() {
  const {
    employees,
    programs,
    loadingLists,
    listError,

    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedProgramId,
    setSelectedProgramId,
    startDate,
    setStartDate,

    selectedEmployee,
    selectedProgram,

    latestQuiz,
    loadingQuiz,
    quizError,
    includeQuiz,
    setIncludeQuiz,
    includeChecklist,
    setIncludeChecklist,
    programHasQuiz,

    canStart,
    submitting,
    submitError,
    handleStart,

    createdOnboarding,
    progress,
  } = useAssignOnboarding();

  const { previewTasks, previewLoading, previewError } =
    useProgramPreview(selectedProgramId);

  const summaryName = selectedEmployee?.fullName || "Välj anställd";
  const summaryProgram = selectedProgram?.name || "Välj program";
  const summaryDate = startDate || "Välj startdatum";
  const programHasChecklist = previewTasks.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        to="/onboarding"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till översikt
      </Link>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-white px-6 py-7">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <UserPlus className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Tilldela onboarding
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Starta ett nytt onboardingflöde för en anställd.
            </p>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {selectedEmployee ? getInitials(selectedEmployee.fullName) : "—"}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-900">{summaryName}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-500">{summaryProgram}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-500">{summaryDate}</span>
          </div>
        </div>

        {listError ? (
          <div className="relative mt-4 text-sm text-red-600">{listError}</div>
        ) : null}

        {submitError ? (
          <div className="relative mt-2 text-sm text-red-600">{submitError}</div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-5 items-start">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <User className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Tilldelningsinformation
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fyll i uppgifter för den nya onboardingen
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="space-y-5 p-6">
              <FormField label="Välj nyanställd">
                <Select
                  className="h-12 text-base rounded-xl"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  disabled={loadingLists}
                >
                  <option value="" disabled>
                    {loadingLists ? "Hämtar..." : "Välj en anställd"}
                  </option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.fullName} ({employee.jobTitle})
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Välj onboardingprogram">
                <Select
                  className="h-12 text-base rounded-xl"
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  disabled={loadingLists}
                >
                  <option value="" disabled>
                    {loadingLists ? "Hämtar..." : "Välj ett program"}
                  </option>
                  {programs.map((program) => (
                    <option key={program._id} value={program._id}>
                      {program.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Startdatum">
                <Input
                  type="date"
                  className="h-12 text-base rounded-xl"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormField>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Innehåll att tilldela
                </h3>

                <div className="space-y-3">
                  <label
                    className={[
                      "flex items-start gap-3 rounded-xl border bg-white p-3",
                      programHasChecklist
                        ? "border-slate-200"
                        : "border-slate-200 opacity-60",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={includeChecklist}
                      onChange={(e) => setIncludeChecklist(e.target.checked)}
                      disabled={!programHasChecklist}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />

                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <ClipboardList className="h-4 w-4 text-blue-600" />
                        Checklista
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {programHasChecklist
                          ? `${previewTasks.length} uppgifter kommer kopieras från programmet.`
                          : "Programmet saknar checklista."}
                      </p>
                    </div>
                  </label>

                  <label
                    className={[
                      "flex items-start gap-3 rounded-xl border bg-white p-3",
                      programHasQuiz
                        ? "border-slate-200"
                        : "border-slate-200 opacity-60",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={includeQuiz}
                      onChange={(e) => setIncludeQuiz(e.target.checked)}
                      disabled={!programHasQuiz || loadingQuiz}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />

                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        Quiz
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {loadingQuiz
                          ? "Hämtar quiz för valt program..."
                          : programHasQuiz
                            ? `${latestQuiz?.quiz?.title || "Quiz"} kommer tilldelas.`
                            : "Inget quiz finns för detta program."}
                      </p>

                      {quizError ? (
                        <p className="mt-1 text-xs text-red-600">{quizError}</p>
                      ) : null}
                    </div>
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  Systemet skapar ett onboardingflöde och tilldelar det innehåll
                  du valt ovan. Den anställde kan börja följa innehållet från
                  startdatumet.
                </p>
              </div>

              <Button
                onClick={handleStart}
                disabled={!canStart || submitting}
                className={[
                  "h-12 w-full rounded-xl text-base font-medium transition",
                  canStart && !submitting
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed",
                ].join(" ")}
              >
                {submitting ? "Startar..." : "Starta onboarding"}
              </Button>

              <p className="text-xs text-slate-500">
                {canStart
                  ? "Redo att starta onboarding för vald anställd."
                  : "Välj nyanställd, program, startdatum och minst ett innehåll att tilldela."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {selectedEmployee ? getInitials(selectedEmployee.fullName) : "—"}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    {selectedEmployee?.fullName || "Ingen anställd vald"}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {selectedEmployee?.jobTitle || "Välj anställd"}{" "}
                    {selectedProgram?.name ? `· ${selectedProgram.name}` : ""}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <ClipboardList className="h-3.5 w-3.5" />
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Checklista
                  </h3>

                  {selectedProgramId && !previewLoading && previewTasks.length > 0 ? (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {previewTasks.length} uppgifter
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              {createdOnboarding ? (
                <>
                  <ProgressBar value={progress?.percent || 0} />

                  <div className="space-y-4">
                    {createdOnboarding.tasks
                      ?.slice()
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((task) => (
                        <TaskCard
                          key={task._id}
                          title={task.title}
                          items={task.items || []}
                          status={task.status}
                          comment={task.comment || ""}
                        />
                      ))}
                  </div>
                </>
              ) : selectedProgramId ? (
                <>
                  {previewLoading ? (
                    <div className="text-sm text-slate-500">
                      Hämtar programmets checklista…
                    </div>
                  ) : previewError ? (
                    <div className="text-sm text-red-600">{previewError}</div>
                  ) : previewTasks.length > 0 ? (
                    <ProgramPreviewList tasks={previewTasks} />
                  ) : (
                    <EmptyStateBox
                      title="Ingen checklista i programmet"
                      description="Detta program saknar checklistTemplate. Skapa en checklista på programsidan först."
                    />
                  )}
                </>
              ) : selectedEmployee ? (
                <EmptyStateBox
                  title="Ingen onboarding skapad ännu"
                  description="Välj program och startdatum för att se förhandsvisningen."
                />
              ) : (
                <EmptyStateBox
                  title="Ingen översikt ännu"
                  description="Välj en anställd till vänster för att komma igång."
                />
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <h3 className="text-sm font-semibold text-slate-900">Quiz</h3>
              </div>
            </div>

            <CardContent className="p-4">
              {!selectedProgramId ? (
                <EmptyStateBox
                  title="Inget program valt"
                  description="Välj ett program för att se om det finns quiz."
                />
              ) : loadingQuiz ? (
                <div className="text-sm text-slate-500">
                  Hämtar quiz för valt program…
                </div>
              ) : quizError ? (
                <div className="text-sm text-red-600">{quizError}</div>
              ) : latestQuiz ? (
                <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {latestQuiz.quiz?.title || "Quiz"}
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {latestQuiz.quiz?.description ||
                      "Quizet kommer tilldelas om du väljer att inkludera det."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {latestQuiz.quiz?.questions?.length || 0} frågor
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {latestQuiz.meta?.language || "sv"}
                    </span>
                  </div>
                </div>
              ) : (
                <EmptyStateBox
                  title="Inget quiz i programmet"
                  description="Det finns inget genererat quiz för detta program ännu."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}