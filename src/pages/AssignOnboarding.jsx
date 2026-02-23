import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FormField, Select, Input } from "../components/ui/Form";

import ProgressBar from "../features/assignOnboarding/components/ProgressBar";
import TaskCard from "../features/assignOnboarding/components/TaskCard";
import EmptyStateBox from "../features/assignOnboarding/components/EmptyStateBox";
import NotesBox from "../features/assignOnboarding/components/NotesBox";

import { useAssignOnboarding } from "../features/assignOnboarding/hooks/useAssignOnboarding";

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

    canStart,
    submitting,
    submitError,
    handleStart,

    createdOnboarding,
    progress,
  } = useAssignOnboarding();

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Tilldela Onboarding & Nyanställd Översikt
        </h1>
        <p className="text-slate-500">Starta ett nytt onboardingflöde för en anställd.</p>

        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">Val:</span>{" "}
          {selectedEmployee?.fullName || "—"} • {selectedProgram?.name || "—"} •{" "}
          {startDate || "—"}
        </div>

        {listError ? <div className="text-sm text-red-600">{listError}</div> : null}
        {submitError ? <div className="text-sm text-red-600">{submitError}</div> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: form */}
        <Card variant="form" className="w-full">
          <CardHeader variant="form">
            <CardTitle className="text-xl">Tilldela Onboardingprogram</CardTitle>
            <CardDescription>Starta ett nytt onboardingflöde för en anställd.</CardDescription>
          </CardHeader>

          <CardContent variant="form" className="space-y-6">
            <FormField label="Välj nyanställd">
              <Select
                className="h-12 text-base"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                disabled={loadingLists}
              >
                <option value="" disabled>
                  {loadingLists ? "Hämtar..." : "Välj en anställd"}
                </option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.fullName} ({e.jobTitle})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Välj onboardingprogram">
              <Select
                className="h-12 text-base"
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                disabled={loadingLists}
              >
                <option value="" disabled>
                  {loadingLists ? "Hämtar..." : "Välj ett program"}
                </option>
                {programs.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Startdatum">
              <Input
                type="date"
                className="h-12 text-base"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormField>

            <div className="pt-2">
              <Button
                onClick={handleStart}
                disabled={!canStart || submitting}
                className={[
                  "h-12 w-full text-base",
                  canStart && !submitting
                    ? "bg-[#1A4D4F] hover:bg-[#1A4D4F]/90"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed",
                ].join(" ")}
              >
                {submitting ? "Startar..." : "Starta"}
              </Button>

              <p className="mt-3 text-xs text-slate-500">
                {canStart
                  ? "Systemet skapar EmployeeOnboarding och kopierar checklistan från programmet."
                  : "Välj nyanställd, program och startdatum för att kunna starta onboarding."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right: overview */}
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Nyanställd Onboarding Översikt</CardTitle>
              <CardDescription>
                {selectedEmployee
                  ? `${selectedEmployee.fullName}s onboarding`
                  : "Välj en anställd för att se översikt."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {createdOnboarding ? (
                <>
                  <ProgressBar value={progress?.percent || 0} />

                  <div className="space-y-4">
                    {createdOnboarding.tasks
                      ?.slice()
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((t) => (
                        <TaskCard
                          key={t._id}
                          title={t.title}
                          items={t.items || []}
                          status={t.status}
                          comment={t.comment || ""}
                        />
                      ))}
                  </div>
                </>
              ) : selectedEmployee ? (
                <EmptyStateBox
                  title="Ingen onboarding skapad ännu"
                  description="Välj program och startdatum och klicka på “Starta”."
                />
              ) : (
                <EmptyStateBox
                  title="Ingen översikt ännu"
                  description="Välj en anställd till vänster för att komma igång."
                />
              )}
            </CardContent>
          </Card>

          <NotesBox />
        </div>
      </div>
    </div>
  );
}