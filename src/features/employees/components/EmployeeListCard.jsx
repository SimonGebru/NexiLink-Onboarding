import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import EmployeeRow from "./EmployeeRow";

export default function EmployeeListCard({
  loading,
  employees,
  showInactive,
  setShowInactive,
  onRefresh,
  onToggleActive,
  onQuickUpdate,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Lista</CardTitle>
            <CardDescription>GET /api/employees (filtrera aktiv/inaktiv i UI)</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
              Visa inaktiva
            </label>

            <Button onClick={onRefresh} className="h-10 px-4">
              Uppdatera
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-sm text-slate-500">Laddar...</div>
        ) : employees.length === 0 ? (
          <div className="text-sm text-slate-500">Inga anställda att visa.</div>
        ) : (
          employees.map((e) => (
            <EmployeeRow
              key={e._id}
              employee={e}
              onToggleActive={onToggleActive}
              onQuickUpdate={onQuickUpdate}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}