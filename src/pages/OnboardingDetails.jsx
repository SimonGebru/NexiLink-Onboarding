import { useParams } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";

import ProgressBar from "../features/onboardingDetails/components/ProgressBar";
import TaskRow from "../features/onboardingDetails/components/TaskRow";
import { useOnboardingDetails } from "../features/onboardingDetails/hooks/useOnboardingDetails";

export default function OnboardingDetails() {
  const { id } = useParams();

  const { onboarding, progress, tasksSorted, loading, error, handlePatched } =
    useOnboardingDetails(id);

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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Onboarding: {employeeName}
        </h1>
        <p className="text-slate-500">
          Program: <span className="text-slate-700 font-medium">{programName}</span>
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