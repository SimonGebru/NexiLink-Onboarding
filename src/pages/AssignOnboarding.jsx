import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { fetchPrograms } from "../services/programService";
import { fetchEmployees } from "../services/employeeService";
import { createOnboarding } from "../services/onboardingService";

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

function TaskCard({ title, items = [], status = "Ej startad", comment = "" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>

          <div className="mt-2 space-y-1">
            {items.map((it, idx) => (
              <div
                key={`${it.label}-${idx}`}
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
          value={comment}
          readOnly
        />
      </div>
    </div>
  );
}

export default function AssignOnboarding() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [startDate, setStartDate] = useState("");

  const [loadingLists, setLoadingLists] = useState(true);
  const [listError, setListError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [createdOnboarding, setCreatedOnboarding] = useState(null);
  const [progress, setProgress] = useState({ total: 0, done: 0, percent: 0 });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoadingLists(true);
        setListError("");

        const [programList, employeeList] = await Promise.all([
          fetchPrograms(),
          fetchEmployees(),
        ]);

        if (!alive) return;

        setPrograms(Array.isArray(programList) ? programList : []);
        // filtrera bort inaktiva, eftersom backend kräver active !== false
        setEmployees(
          Array.isArray(employeeList)
            ? employeeList.filter((e) => e.active !== false)
            : []
        );
      } catch (err) {
        if (!alive) return;
        setListError(err?.message || "Kunde inte hämta listor.");
      } finally {
        if (!alive) return;
        setLoadingLists(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e._id === selectedEmployeeId) || null,
    [employees, selectedEmployeeId]
  );

  const selectedProgram = useMemo(
    () => programs.find((p) => p._id === selectedProgramId) || null,
    [programs, selectedProgramId]
  );

  const canStart = Boolean(selectedEmployeeId && selectedProgramId && startDate);

  async function handleStart() {
  if (!canStart || submitting) return;

  try {
    setSubmitting(true);
    setSubmitError("");

    const res = await createOnboarding({
      employeeId: selectedEmployeeId,
      programId: selectedProgramId,
      startDate,
    });

    // res = { onboarding, progress }
    setCreatedOnboarding(res.onboarding);
    setProgress(res.progress);

    const onboardingId = res?.onboarding?._id;
    if (onboardingId) {
      navigate(`/onboardings/${onboardingId}`);
    }
  } catch (err) {
    setSubmitError(err?.message || "Kunde inte starta onboarding.");
  } finally {
    setSubmitting(false);
  }
}

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
          {selectedEmployee?.fullName || "—"} • {selectedProgram?.name || "—"} •{" "}
          {startDate || "—"}
        </div>

        {listError ? <div className="text-sm text-red-600">{listError}</div> : null}
        {submitError ? <div className="text-sm text-red-600">{submitError}</div> : null}
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

        {/* Right column: Overview */}
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
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                  <div className="text-sm font-semibold text-slate-900">
                    Ingen onboarding skapad ännu
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Välj program och startdatum och klicka på “Starta”.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6">
                  <div className="text-sm font-semibold text-slate-900">
                    Ingen översikt ännu
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Välj en anställd till vänster för att komma igång.
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