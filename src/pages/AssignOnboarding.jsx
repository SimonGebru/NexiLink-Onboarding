import { useMemo, useState } from "react";
import { FileText, Link as LinkIcon } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import Button from "../components/ui/Button";
import { FormField, Select, Input, Textarea } from "../components/ui/Form";

function ProgressBar({ value = 0 }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-900">
          Procent klar: {safe}%
        </div>
        <div className="text-xs text-slate-500">Senast uppdaterad: idag</div>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-[#1A4D4F]" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Klar: "bg-green-50 text-green-700 border border-green-200",
    Pågår: "bg-blue-50 text-blue-700 border border-blue-200",
    "Ej startad": "bg-slate-50 text-slate-700 border border-slate-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        map[status] || map["Ej startad"],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function TaskCard({
  title,
  items = [],
  status = "Ej startad",
  notePlaceholder = "Lägg till kommentar...",
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>

          <div className="mt-2 space-y-1">
            {items.map((it) => (
              <div
                key={it.label}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                {it.type === "file" ? (
                  <FileText className="h-4 w-4 text-slate-400" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-slate-400" />
                )}
                <span className="truncate">{it.label}</span>
              </div>
            ))}
          </div>
        </div>

        <StatusPill status={status} />
      </div>

      <div className="mt-3">
        <Textarea
          className="min-h-[90px] text-sm"
          rows={4}
          placeholder={notePlaceholder}
        />
      </div>
    </div>
  );
}

export default function AssignOnboarding() {
  const employees = useMemo(
    () => ["Erik Svensson", "Lena Karlsson", "Maria Lundgren", "Kalle Persson"],
    []
  );

  const programs = useMemo(
    () => [
      "Intro för nyanställd",
      "Senior konsult onboarding",
      "Praktikantprogram sommar 2024",
    ],
    []
  );

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [startDate, setStartDate] = useState("");

  const progress = 75;

  const overviewCards = [
    {
      title: "Välkomstpaket & Introduktion",
      status: "Klar",
      items: [
        { type: "file", label: "Välkomstguide.pdf" },
        { type: "file", label: "Företagspresentation.pptx" },
      ],
    },
    {
      title: "Systemåtkomster & IT-Setup",
      status: "Pågår",
      items: [
        { type: "file", label: "IT policy.pdf" },
        { type: "file", label: "Inloggningsguide.pdf" },
      ],
      notePlaceholder: "Väntar på aktivering av konto för Teams och Jira...",
    },
    {
      title: "Möte med Mentor",
      status: "Ej startad",
      items: [{ type: "link", label: "Boka möte (länk)" }],
    },
    {
      title: "Utbildning i Verktyg",
      status: "Ej startad",
      items: [{ type: "file", label: "Verktygsmanual.pdf" }],
    },
  ];

  const canStart = Boolean(selectedEmployee && selectedProgram && startDate);

  return (
    <div className="w-full space-y-6">
      {/* Page title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Tilldela Onboarding & Nyanställd Översikt
        </h1>
        <p className="text-slate-500">
          Starta ett nytt onboardingflöde för en anställd.
        </p>

        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">Val:</span>{" "}
          {selectedEmployee || "—"} • {selectedProgram || "—"} •{" "}
          {startDate || "—"}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: Assign form */}
        <Card variant="form" className="w-full">
          <CardHeader variant="form">
            <CardTitle className="text-xl">Tilldela Onboardingprogram</CardTitle>
            <CardDescription>
              Starta ett nytt onboardingflöde för en anställd.
            </CardDescription>
          </CardHeader>

          <CardContent variant="form" className="space-y-6">
            <FormField label="Välj nyanställd">
              <Select
                className="h-12 text-base"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="" disabled>
                  Välj en anställd
                </option>
                {employees.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Välj onboardingprogram">
              <Select
                className="h-12 text-base"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
              >
                <option value="" disabled>
                  Välj ett program
                </option>
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
                disabled={!canStart}
                className={[
                  "h-12 w-full text-base",
                  canStart
                    ? "bg-[#1A4D4F] hover:bg-[#1A4D4F]/90"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed",
                ].join(" ")}
              >
                Starta
              </Button>

              <p className="mt-3 text-xs text-slate-500">
                {canStart
                  ? "Systemet skapar EmployeeOnboarding-status och kopierar checklistan till individens instans."
                  : "Välj nyanställd, program och startdatum för att kunna starta onboarding."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right column: Overview */}
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Nyanställd Onboarding Översikt</CardTitle>
              <CardDescription>
                {selectedEmployee
                  ? `${selectedEmployee}s onboarding för introduktionen`
                  : "Välj en anställd för att se översikt."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {selectedEmployee ? (
                <>
                  <ProgressBar value={progress} />

                  <div className="space-y-4">
                    {overviewCards.map((c) => (
                      <TaskCard
                        key={c.title}
                        title={c.title}
                        items={c.items}
                        status={c.status}
                        notePlaceholder={c.notePlaceholder}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                  <div className="text-sm font-semibold text-slate-900">
                    Ingen översikt ännu
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Välj en anställd till vänster för att se status, material och kommentarer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              Viktiga anmärkningar (MVP/V1)
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li>Ingen AI-analys</li>
              <li>Inga automatiska påminnelser</li>
              <li>Enkel checklist + materialhantering = status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}