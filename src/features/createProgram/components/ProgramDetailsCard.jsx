import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { FormField, Input, Select, Textarea } from "../../../components/ui/Form";

export default function ProgramDetailsCard({
  // lists
  units,
  roles,

  // fields
  title,
  unit,
  role,
  description,
  responsible,

  // setters
  setTitle,
  setUnit,
  setRole,
  setDescription,
  setResponsible,

  // state
  saving,
  error,

  // actions
  onOpenUploadModal,
  onCreateProgram,
}) {
  return (
    <Card variant="form" className="w-full">
      <CardHeader variant="form">
        <CardTitle className="text-xl sm:text-2xl">Programdetaljer</CardTitle>
        <CardDescription className="text-base">
          Fyll i informationen nedan för att skapa ett nytt onboardingprogram.
        </CardDescription>
      </CardHeader>

      <CardContent variant="form" className="space-y-10">
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

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Enhet">
            <Select
              className="h-12 text-base"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="" disabled>
                Välj en enhet
              </option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Roll">
            <Select
              className="h-12 text-base"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Välj en roll
              </option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField label="Beskrivning (valfri)">
          <Textarea
            className="text-base min-h-[200px]"
            rows={6}
            placeholder="Ange en kort beskrivning av programmet..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <FormField label="Ansvarig (valfri)">
          <Input
            className="h-12 text-base"
            placeholder="Namn på ansvarig person eller avdelning"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
          />
        </FormField>

        <div className="pt-2 border-t border-slate-100" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-base font-semibold text-slate-900">
              Ladda upp material
            </div>
            <p className="text-sm sm:text-base text-slate-500">
              Ladda upp filer och länkar direkt här innan du fortsätter.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-slate-900 text-white text-base font-medium shadow-sm hover:bg-slate-800 transition-colors"
          >
            Ladda upp material
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" onClick={onCreateProgram} disabled={saving}>
            {saving ? "Skapar..." : "Skapa program"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}