import { useEffect, useMemo, useState } from "react";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import Button from "../components/ui/Button";
import { FormField, Input, Select } from "../components/ui/Form";

function Pill({ children, tone = "slate" }) {
  const tones = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone] || tones.slate,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);

  
  const [showInactive, setShowInactive] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await fetchEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Kunde inte hämta anställda.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleEmployees = useMemo(() => {
    const list = employees.slice();
    if (!showInactive) return list.filter((e) => e.active !== false);
    return list;
  }, [employees, showInactive]);

  async function handleCreate() {
    if (creating) return;

    // Minimala checks (backend validerar ändå)
    if (!fullName.trim() || !jobTitle.trim() || !email.trim()) {
      setErr("Fyll i fullName, jobTitle och email.");
      return;
    }

    try {
      setCreating(true);
      setErr("");

      const created = await createEmployee({
        fullName: fullName.trim(),
        jobTitle: jobTitle.trim(),
        email: email.trim(),
      });

      
      setEmployees((prev) => [created, ...prev]);
      setFullName("");
      setJobTitle("");
      setEmail("");
    } catch (e) {
      setErr(e?.message || "Kunde inte skapa anställd.");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(emp) {
    try {
      setErr("");

      
      if (emp.active === false) {
        // återaktivera via PATCH
        const updated = await updateEmployee(emp._id, { active: true });
        setEmployees((prev) =>
          prev.map((x) => (x._id === emp._id ? updated : x)),
        );
      } else {
        await deleteEmployee(emp._id);
        // vi vet att backend sätter active=false, så vi uppdaterar UI
        setEmployees((prev) =>
          prev.map((x) => (x._id === emp._id ? { ...x, active: false } : x)),
        );
      }
    } catch (e) {
      setErr(e?.message || "Kunde inte uppdatera status.");
    }
  }

  async function handleQuickUpdate(emp, patch) {
    try {
      setErr("");
      const updated = await updateEmployee(emp._id, patch);
      setEmployees((prev) =>
        prev.map((x) => (x._id === emp._id ? updated : x)),
      );
    } catch (e) {
      setErr(e?.message || "Kunde inte spara ändring.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
        <p className="text-slate-500">
          Skapa, uppdatera och inaktivera anställda (kopplat till backend).
        </p>
        {err ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}
      </div>

      {/* Create */}
      <Card>
        <CardHeader>
          <CardTitle>Skapa anställd</CardTitle>
          <CardDescription>
            Motsvarar POST /api/employees (tidigare Postman).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Fullständigt namn (fullName)">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </FormField>

            <FormField label="Titel (jobTitle)">
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </FormField>

            <FormField label="Email">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="h-10 px-4 bg-[#1A4D4F] hover:bg-[#1A4D4F]/90"
            >
              {creating ? "Skapar..." : "Skapa"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Lista</CardTitle>
              <CardDescription>
                GET /api/employees (filtrera aktiv/inaktiv i UI)
              </CardDescription>
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

              <Button onClick={load} className="h-10 px-4">
                Uppdatera
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : visibleEmployees.length === 0 ? (
            <div className="text-sm text-slate-500">Inga anställda att visa.</div>
          ) : (
            visibleEmployees.map((e) => (
              <div
                key={e._id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {e.fullName}
                    </div>
                    <div className="text-sm text-slate-500 truncate">
                      {e.email}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {e.active === false ? (
                      <Pill tone="red">Inaktiv</Pill>
                    ) : (
                      <Pill tone="green">Aktiv</Pill>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <FormField label="jobTitle">
                    <Input
                      defaultValue={e.jobTitle || ""}
                      onBlur={(ev) => {
                        const next = ev.target.value.trim();
                        if (next !== (e.jobTitle || "")) {
                          handleQuickUpdate(e, { jobTitle: next });
                        }
                      }}
                    />
                  </FormField>

                  <FormField label="active">
                    <Select
                      defaultValue={e.active === false ? "false" : "true"}
                      onChange={(ev) => {
                        const nextActive = ev.target.value === "true";
                        handleQuickUpdate(e, { active: nextActive });
                      }}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </Select>
                  </FormField>

                  <div className="flex items-end justify-end gap-2">
                    <Button
                      onClick={() => handleToggleActive(e)}
                      className="h-10 px-4"
                    >
                      {e.active === false ? "Återaktivera" : "Inaktivera"}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}