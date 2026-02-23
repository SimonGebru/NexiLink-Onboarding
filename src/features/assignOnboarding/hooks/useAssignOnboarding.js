import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchPrograms } from "../../../services/programService";
import { fetchEmployees } from "../../../services/employeeService";
import { createOnboarding } from "../../../services/onboardingService";

export function useAssignOnboarding() {
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

      setCreatedOnboarding(res?.onboarding || null);
      setProgress(res?.progress || { total: 0, done: 0, percent: 0 });

      const onboardingId = res?.onboarding?._id;
      if (onboardingId) navigate(`/onboardings/${onboardingId}`);
    } catch (err) {
      setSubmitError(err?.message || "Kunde inte starta onboarding.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    // lists
    employees,
    programs,
    loadingLists,
    listError,

    // selections
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedProgramId,
    setSelectedProgramId,
    startDate,
    setStartDate,

    selectedEmployee,
    selectedProgram,

    // submit
    canStart,
    submitting,
    submitError,
    handleStart,

    // created
    createdOnboarding,
    progress,
  };
}