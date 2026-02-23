import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../../services/api";
import { getUiStatus } from "../utils/getUiStatus";

export function useOnboardingOverviewData() {
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programError, setProgramError] = useState("");

  const [activeOnboardings, setActiveOnboardings] = useState([]);
  const [loadingOnboardings, setLoadingOnboardings] = useState(true);
  const [onboardingError, setOnboardingError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadPrograms() {
      try {
        setLoadingPrograms(true);
        setProgramError("");

        const data = await apiRequest("/api/programs", { method: "GET" });
        if (!alive) return;

        setPrograms(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;

        const msg = err?.message || "";
        if (msg.toLowerCase().includes("no programs found")) {
          setPrograms([]);
          setProgramError("");
        } else {
          setProgramError(msg || "Kunde inte hämta program.");
        }
      } finally {
        if (!alive) return;
        setLoadingPrograms(false);
      }
    }

    loadPrograms();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadOnboardings() {
      try {
        setLoadingOnboardings(true);
        setOnboardingError("");

        const data = await apiRequest("/api/onboardings?status=active", {
          method: "GET",
        });

        if (!alive) return;
        setActiveOnboardings(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;
        setOnboardingError(err?.message || "Kunde inte hämta onboardings.");
      } finally {
        if (!alive) return;
        setLoadingOnboardings(false);
      }
    }

    loadOnboardings();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const programTotal = programs.length;

    const rows = activeOnboardings || [];
    let ongoing = 0;
    let done = 0;
    let needsAction = 0;

    for (const row of rows) {
      const uiStatus = getUiStatus(row?.progress, row?.onboarding?.overallStatus);
      if (uiStatus === "Klar") done++;
      else if (uiStatus === "Pågår") ongoing++;
      else needsAction++;
    }

    return { programTotal, ongoing, done, needsAction };
  }, [programs, activeOnboardings]);

  return {
    programs,
    loadingPrograms,
    programError,

    activeOnboardings,
    loadingOnboardings,
    onboardingError,

    stats,
  };
}