import { useEffect, useMemo, useState } from "react";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../services/employeeService";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Create form state
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);

  // Filter
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
        const updated = await updateEmployee(emp._id, { active: true });
        setEmployees((prev) => prev.map((x) => (x._id === emp._id ? updated : x)));
      } else {
        await deleteEmployee(emp._id);
        setEmployees((prev) =>
          prev.map((x) => (x._id === emp._id ? { ...x, active: false } : x))
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
      setEmployees((prev) => prev.map((x) => (x._id === emp._id ? updated : x)));
    } catch (e) {
      setErr(e?.message || "Kunde inte spara ändring.");
    }
  }

  return {
    // data
    employees,
    visibleEmployees,
    loading,
    err,

    // create form
    fullName,
    setFullName,
    jobTitle,
    setJobTitle,
    email,
    setEmail,
    creating,

    // filter
    showInactive,
    setShowInactive,

    // actions
    load,
    handleCreate,
    handleToggleActive,
    handleQuickUpdate,
    setErr,
  };
}