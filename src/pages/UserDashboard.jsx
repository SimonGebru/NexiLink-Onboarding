import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import ProgressBar from "../features/assignOnboarding/components/ProgressBar";
import StatusPill from "../features/assignOnboarding/components/StatusPill";

// Mock
const data = {
  name: "Simon",
  active: {
    id: "1",
    programName: "Socialsekreterare onboarding",
    progress: 30,
    completed: 3,
    total: 10,
  },
  nextTasks: [
    { id: "1", title: "Gå igenom rutinen för orosanmälan", status: "Pågår" },
    { id: "2", title: "Träffa handledare och mentor", status: "Ej startad" },
    { id: "3", title: "Dokumentera ett testärende", status: "Ej startad" },
  ],
};

export default function UserDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Hej {data.name}
        </h1>
        <p className="text-slate-500">
          Här ser du vad du ska fokusera på i din onboarding.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT (main content) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Aktiv onboarding */}
          <Card>
            <CardHeader>
              <CardTitle>Fortsätt där du slutade</CardTitle>
              <CardDescription>Din aktiva onboarding</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-slate-900">
                  {data.active.programName}
                </div>
                <StatusPill status="Pågår" />
              </div>

              <div className="text-sm text-slate-500">
                {data.active.completed} / {data.active.total} uppgifter klara
              </div>

              <ProgressBar value={data.active.progress} />

              <Link
                to={`/my/onboarding/${data.active.id}`}
                className="inline-block text-sm font-medium text-[#1A4D4F] hover:underline"
              >
                Fortsätt onboarding →
              </Link>
            </CardContent>
          </Card>

          {/* Nästa uppgifter */}
          <Card>
            <CardHeader>
              <CardTitle>Nästa uppgifter</CardTitle>
              <CardDescription>Detta bör du göra härnäst</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {data.nextTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50 transition"
                >
                  <div className="text-sm text-slate-900">{task.title}</div>
                  <StatusPill status={task.status} />
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT (side content) */}
        <div className="space-y-6">

          {/* Progress card */}
          <Card>
            <CardHeader>
              <CardTitle>Din progress</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">
                  Uppgifter klara
                </div>
                <ProgressBar value={data.active.progress} />
              </div>

              <div className="text-sm text-slate-500">
                {data.active.completed} av {data.active.total} uppgifter klara
              </div>
            </CardContent>
          </Card>

          {/* Snabbt */}
          <Card>
            <CardHeader>
              <CardTitle>Snabbt</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Link
                to="/my/onboardings"
                className="block text-sm text-[#1A4D4F] hover:underline"
              >
                Se alla mina onboardings
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}