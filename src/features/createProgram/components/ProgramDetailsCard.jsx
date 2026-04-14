import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { FormField, Input, Textarea } from "../../../components/ui/Form";

export default function ProgramDetailsCard({
  units,
  roles,
  title,
  unit,
  role,
  description,
  responsible,
  setTitle,
  setUnit,
  setRole,
  setDescription,
  setResponsible,
  saving,
  error,
  onOpenUploadModal,
  onCreateProgram,
}) {
  const [showExtraDetails, setShowExtraDetails] = useState(false);

  return (
    <Card variant="form" className="w-full max-w-4xl mx-auto">
      <CardHeader variant="form" className="pb-4">
        <CardTitle className="text-2xl sm:text-3xl text-slate-900">
          Programdetaljer
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-slate-500">
          Fyll i informationen nedan för att skapa ett nytt onboardingprogram.
        </CardDescription>
      </CardHeader>

      <CardContent variant="form" className="space-y-8">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <FormField label="Programnamn">
          <Input
            className="h-12 text-base"
            placeholder="T.ex. Ny anställd i marknadsavdelningen"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>

        <FormField label="Beskrivning (valfri)">
          <Textarea
            className="text-base min-h-[180px]"
            rows={6}
            placeholder="Ange en kort beskrivning av programmet..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <div className="border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => setShowExtraDetails((prev) => !prev)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span
              className={`inline-block transition-transform ${
                showExtraDetails ? "rotate-90" : ""
              }`}
            >
              ›
            </span>
            Ytterligare detaljer (enhet, roll, ansvarig)
          </button>

          {showExtraDetails ? (
            <div className="mt-5 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Enhet">
                  <>
                    <Input
                      className="h-12 text-base"
                      placeholder="Välj eller skriv en enhet"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      list="unit-suggestions"
                    />
                    <datalist id="unit-suggestions">
                      {(units || []).map((u) => (
                        <option key={u} value={u} />
                      ))}
                    </datalist>
                  </>
                </FormField>

                <FormField label="Roll">
                  <>
                    <Input
                      className="h-12 text-base"
                      placeholder="Välj eller skriv en roll"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      list="role-suggestions"
                    />
                    <datalist id="role-suggestions">
                      {(roles || []).map((r) => (
                        <option key={r} value={r} />
                      ))}
                    </datalist>
                  </>
                </FormField>
              </div>

              <FormField label="Ansvarig (valfri)">
                <Input
                  className="h-12 text-base"
                  placeholder="Namn på ansvarig person eller avdelning"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                />
              </FormField>
            </div>
          ) : null}
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="text-base font-semibold text-slate-900">
                Ladda upp material
              </div>
              <p className="text-sm text-slate-500">
                Ladda upp filer och länkar direkt här innan du fortsätter.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenUploadModal}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors"
            >
              Ladda upp material
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Avbryt
            </button>

            <Button type="button" onClick={onCreateProgram} disabled={saving}>
              {saving ? "Skapar..." : "Fortsätt till material"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}