import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, FileText, Link as LinkIcon } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

const mockOnboarding = {
  id: "1",
  programName: "Socialsekreterare onboarding",
  status: "Pågår",
  startDate: "2026-04-21",
  progress: {
    percent: 30,
    completed: 3,
    total: 10,
  },
  tasks: [
    {
      id: "t1",
      title: "Aktivera konto i verksamhetssystemet",
      description: "Logga in, verifiera åtkomst och säkerställ att du kommer in i rätt system.",
      status: "Klar",
      items: [
        { type: "file", label: "Guide – inloggning.pdf" },
      ],
      comment: "Inloggning fungerar."
    },
    {
      id: "t2",
      title: "Gå igenom rutinen för orosanmälan",
      description: "Ta del av rutinen och förstå hur processen ser ut i praktiken.",
      status: "Pågår",
      items: [
        { type: "file", label: "Rutin orosanmälan.pdf" },
        { type: "link", label: "Intern länk till processöversikt" },
      ],
      comment: ""
    },
    {
      id: "t3",
      title: "Träffa handledare och mentor",
      description: "Ha ett första möte för att gå igenom upplägg, förväntningar och stöd.",
      status: "Ej startad",
      items: [],
      comment: ""
    },
    {
      id: "t4",
      title: "Dokumentera ett testärende enligt mall",
      description: "Gå igenom hur dokumentation ska göras och fyll i ett testärende.",
      status: "Ej startad",
      items: [
        { type: "file", label: "Dokumentationsmall.docx" },
      ],
      comment: ""
    },
  ],
};

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("sv-SE").format(date);
}

function getStatusPill(status) {
  if (status === "Klar") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Pågår") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-slate-100 text-slate-600";
}

function getStatusIcon(status) {
  if (status === "Klar") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }

  if (status === "Pågår") {
    return <Clock3 className="h-4 w-4 text-blue-600" />;
  }

  return <Clock3 className="h-4 w-4 text-slate-400" />;
}

function sortTasks(tasks = []) {
  const order = {
    "Pågår": 0,
    "Ej startad": 1,
    "Klar": 2,
  };

  return [...tasks].sort((a, b) => {
    const statusDiff = (order[a.status] ?? 99) - (order[b.status] ?? 99);
    if (statusDiff !== 0) return statusDiff;

    return a.title.localeCompare(b.title, "sv");
  });
}

function UserTaskCard({ task }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">{getStatusIcon(task.status)}</div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {task.title}
                </h3>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusPill(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              {task.description ? (
                <p className="mt-1 text-sm text-slate-500">
                  {task.description}
                </p>
              ) : null}
            </div>
          </div>

          {Array.isArray(task.items) && task.items.length > 0 ? (
            <div className="mt-4 space-y-2">
              {task.items.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  {item.type === "file" ? (
                    <FileText className="h-4 w-4 text-slate-400" />
                  ) : (
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                  )}

                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          ) : null}

          {task.comment ? (
            <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Kommentar: </span>
              {task.comment}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function UserOnboardingDetails() {
  const { id } = useParams();
  const [filter, setFilter] = useState("Alla");

  const onboarding = mockOnboarding;

  const filteredTasks = useMemo(() => {
    const sorted = sortTasks(onboarding.tasks);

    if (filter === "Alla") return sorted;
    return sorted.filter((task) => task.status === filter);
  }, [filter, onboarding.tasks]);

  const counts = useMemo(() => {
    return {
      all: onboarding.tasks.length,
      notStarted: onboarding.tasks.filter((task) => task.status === "Ej startad").length,
      ongoing: onboarding.tasks.filter((task) => task.status === "Pågår").length,
      done: onboarding.tasks.filter((task) => task.status === "Klar").length,
    };
  }, [onboarding.tasks]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Tillbaka till dashboard
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {onboarding.programName}
            </h1>
            <p className="text-slate-500 mt-1">
              Här ser du din onboarding, dina uppgifter och hur långt du har kommit.
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${getStatusPill(
              onboarding.status
            )}`}
          >
            {onboarding.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Startdatum
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {formatDate(onboarding.startDate)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Klara uppgifter
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {onboarding.progress.completed}/{onboarding.progress.total}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Progress
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {onboarding.progress.percent}%
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${onboarding.progress.percent}%` }}
            />
          </div>
        </div>
      </div>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Mina uppgifter</CardTitle>
          <CardDescription>
            Här hittar du alla uppgifter som ingår i din onboarding.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("Alla")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Alla"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Alla ({counts.all})
            </button>

            <button
              type="button"
              onClick={() => setFilter("Ej startad")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Ej startad"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Ej startad ({counts.notStarted})
            </button>

            <button
              type="button"
              onClick={() => setFilter("Pågår")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Pågår"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Pågår ({counts.ongoing})
            </button>

            <button
              type="button"
              onClick={() => setFilter("Klar")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === "Klar"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Klar ({counts.done})
            </button>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <UserTaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-900">
                Inga uppgifter i den här vyn
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Testa att byta filter för att se andra uppgifter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-slate-400">
        Onboarding-ID: {id}
      </div>
    </div>
  );
}