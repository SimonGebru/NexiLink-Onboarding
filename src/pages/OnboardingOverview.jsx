import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { ChevronRight, Plus } from "lucide-react";

const programs = [
  {
    id: "intro",
    title: "Intro för nyanställd",
    description: "Standard onboarding för alla nya anställda",
  },
  {
    id: "senior",
    title: "Senior konsult onboarding",
    description: "Anpassat program för erfarna konsulter",
  },
  {
    id: "intern",
    title: "Praktikantprogram sommar 2024",
    description: "Strukturerad introduktion för sommarpraktikanter",
  },
];

const activeOnboardings = [
  { id: "a1", name: "Erik Svensson", role: "Säljare", status: "Pågår" },
  { id: "a2", name: "Lena Karlsson", role: "Utvecklare", status: "Ej startad" },
  { id: "a3", name: "Maria Lundgren", role: "Marknadsförare", status: "Klar" },
  { id: "a4", name: "Kalle Persson", role: "Projektledare", status: "Pågår" },
];

function StatusPill({ status }) {
  const map = {
    "Pågår": "bg-blue-50 text-blue-700 border-blue-200",
    "Ej startad": "bg-slate-50 text-slate-700 border-slate-200",
    "Klar": "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        map[status] || map["Ej startad"],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function ListRow({ title, subtitle, right }) {
  return (
    <div
      className="
        group
        flex items-center justify-between
        rounded-lg border border-slate-200 bg-white
        px-4 py-3
        hover:bg-slate-50
        hover:border-slate-300
        transition-colors
      "
    >
      <div className="min-w-0">
        <div className="font-medium text-slate-900">{title}</div>
        {subtitle ? (
          <div className="text-sm text-slate-500">{subtitle}</div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}

export default function OnboardingOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Onboarding – Översikt
          </h1>
          <p className="text-slate-500 mt-1">
            Skapa program, tilldela till anställda och följ status.
          </p>
        </div>

        <Link to="/programs/new" className="sm:self-start">
  <button
    className="
      w-full sm:w-auto
      inline-flex items-center justify-center gap-2
      rounded-lg
      bg-blue-600
      px-4 py-2
      text-sm font-medium text-white
      shadow-sm
      hover:bg-blue-700
      transition
    "
  >
    <span className="text-base leading-none">+</span>
    Skapa nytt program
  </button>
</Link>
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Programs */}
        <Card>
          <CardHeader>
            <CardTitle>Onboardingprogram</CardTitle>
            <CardDescription>
              Välj ett program för att redigera eller återanvända.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {programs.map((p) => (
              <Link key={p.id} to={`/programs/${p.id}/material`}>
                <ListRow title={p.title} subtitle={p.description} right={null} />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Active onboardings */}
        <Card>
          <CardHeader>
            <CardTitle>Aktiva onboardings</CardTitle>
            <CardDescription>Pågående onboarding för nyanställda.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {activeOnboardings.map((a) => (
              <Link key={a.id} to="/assignments">
                <ListRow
                  title={a.name}
                  subtitle={a.role}
                  right={<StatusPill status={a.status} />}
                />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}