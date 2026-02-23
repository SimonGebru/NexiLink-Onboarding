import Button from "../../../components/ui/Button";
import { FormField, Input, Select } from "../../../components/ui/Form";
import Pill from "./Pill";

export default function EmployeeRow({ employee, onToggleActive, onQuickUpdate }) {
  const e = employee;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{e.fullName}</div>
          <div className="text-sm text-slate-500 truncate">{e.email}</div>
        </div>

        <div className="flex items-center gap-2">
          {e.active === false ? <Pill tone="red">Inaktiv</Pill> : <Pill tone="green">Aktiv</Pill>}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <FormField label="jobTitle">
          <Input
            defaultValue={e.jobTitle || ""}
            onBlur={(ev) => {
              const next = ev.target.value.trim();
              if (next !== (e.jobTitle || "")) {
                onQuickUpdate(e, { jobTitle: next });
              }
            }}
          />
        </FormField>

        <FormField label="active">
          <Select
            defaultValue={e.active === false ? "false" : "true"}
            onChange={(ev) => {
              const nextActive = ev.target.value === "true";
              onQuickUpdate(e, { active: nextActive });
            }}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </Select>
        </FormField>

        <div className="flex items-end justify-end gap-2">
          <Button onClick={() => onToggleActive(e)} className="h-10 px-4">
            {e.active === false ? "Återaktivera" : "Inaktivera"}
          </Button>
        </div>
      </div>
    </div>
  );
}