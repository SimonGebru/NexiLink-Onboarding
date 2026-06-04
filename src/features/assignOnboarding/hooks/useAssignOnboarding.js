import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchPrograms } from "../../../services/programService";
import { fetchEmployees } from "../../../services/employeeService";
import { createOnboarding } from "../../../services/onboardingService";
import { fetchLatestProgramQuiz } from "../../../services/aiquiz";

export function useAssignOnboarding() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [startDate, setStartDate] = useState("");

  const [latestQuiz, setLatestQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [includeQuiz, setIncludeQuiz] = useState(false);
  const [includeChecklist, setIncludeChecklist] = useState(true);

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

        setEmployees(
          Array.isArray(employeeList)
            ? employeeList.filter((employee) => employee.active !== false)
            : [],
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

  useEffect(() => {
    let alive = true;

    async function loadQuizForProgram() {
      if (!selectedProgramId) {
        setLatestQuiz(null);
        setIncludeQuiz(false);
        setQuizError("");
        return;
      }

      try {
        setLoadingQuiz(true);
        setQuizError("");

        const res = await fetchLatestProgramQuiz(selectedProgramId);

        if (!alive) return;

        const quiz = res?.quiz || null;

        setLatestQuiz(quiz);
        setIncludeQuiz(Boolean(quiz?._id));
      } catch (err) {
        if (!alive) return;

        setLatestQuiz(null);
        setIncludeQuiz(false);
        setQuizError(err?.message || "Kunde inte hämta quiz för programmet.");
      } finally {
        if (!alive) return;
        setLoadingQuiz(false);
      }
    }

    loadQuizForProgram();

    return () => {
      alive = false;
    };
  }, [selectedProgramId]);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee._id === selectedEmployeeId) || null,
    [employees, selectedEmployeeId],
  );

  const selectedProgram = useMemo(
    () => programs.find((program) => program._id === selectedProgramId) || null,
    [programs, selectedProgramId],
  );

  const programHasChecklist =
    Array.isArray(selectedProgram?.checklistTemplate) &&
    selectedProgram.checklistTemplate.length > 0;

  const programHasQuiz = Boolean(latestQuiz?._id);

  const canStart = Boolean(
    selectedEmployeeId &&
      selectedProgramId &&
      startDate &&
      (includeChecklist || includeQuiz),
  );

  async function handleStart() {
    if (!canStart || submitting) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      const payload = {
        employeeId: selectedEmployeeId,
        programId: selectedProgramId,
        startDate,
      };

      if (includeQuiz && latestQuiz?._id) {
        payload.quizId = latestQuiz._id;
      }

      // Detta skickas med redan nu, men kräver backend-stöd om ni vill tillåta "bara quiz".
      payload.includeChecklist = includeChecklist;

      const res = await createOnboarding(payload);

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
    employees,
    programs,
    loadingLists,
    listError,

    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedProgramId,
    setSelectedProgramId,
    startDate,
    setStartDate,

    selectedEmployee,
    selectedProgram,

    latestQuiz,
    loadingQuiz,
    quizError,
    includeQuiz,
    setIncludeQuiz,
    includeChecklist,
    setIncludeChecklist,
    programHasChecklist,
    programHasQuiz,

    canStart,
    submitting,
    submitError,
    handleStart,

    createdOnboarding,
    progress,
  };
}