import EmployeeCreateCard from "../features/employees/components/EmployeeCreateCard";
import EmployeeListCard from "../features/employees/components/EmployeeListCard";
import { useEmployees } from "../features/employees/hooks/useEmployees";

export default function Employees() {
  const {
    visibleEmployees,
    loading,
    err,

    fullName,
    setFullName,
    jobTitle,
    setJobTitle,
    email,
    setEmail,
    creating,

    showInactive,
    setShowInactive,

    load,
    handleCreate,
    handleToggleActive,
    handleQuickUpdate,
  } = useEmployees();

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

      <EmployeeCreateCard
        fullName={fullName}
        setFullName={setFullName}
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        email={email}
        setEmail={setEmail}
        creating={creating}
        onCreate={handleCreate}
      />

      <EmployeeListCard
        loading={loading}
        employees={visibleEmployees}
        showInactive={showInactive}
        setShowInactive={setShowInactive}
        onRefresh={load}
        onToggleActive={handleToggleActive}
        onQuickUpdate={handleQuickUpdate}
      />
    </div>
  );
}