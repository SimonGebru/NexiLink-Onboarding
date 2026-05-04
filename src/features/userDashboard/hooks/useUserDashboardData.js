import { useEffect, useMemo, useState } from "react";
import { fetchMyOnboardings } from "../../../services/userDashboardService";

function normalizeProgress(raw) {
  const p = raw ?? {};

  const total = Number(p.total ?? p.tasksTotal ?? 0) || 0;
  const completed = Number(p.completed ?? p.done ?? 0) || 0;

  const hasTotal = total > 0;
  const calculatedPercent = hasTotal ? Math.round((completed / total) * 100) : 0;
  const percent = Number.isFinite(p.percent) ? p.percent : calculatedPercent;

  return { total, completed, percent };
}

function normalizeOnboarding(raw) {
  if (!raw) return null;

  const id = raw.id ?? raw._id ?? raw.onboardingId ?? raw.onboarding?._id ?? raw.onboarding?.id;
  const programName = raw.programName ?? raw.program?.name ?? "—";
  const status = raw.status ?? raw.overallStatus ?? "Ej startad";
  const startDate = raw.startDate ?? raw.createdAt ?? null;
  const progress = normalizeProgress(raw.progress);

  return { id, programName, status, startDate, progress };
}

function sortOnboardings(items = []) {
  const order = {
    Pågår: 0,
    "Ej startad": 1,
    Klar: 2,
  };

  return [...items].sort((a, b) => {
    const statusDiff = (order[a.status] ?? 99) - (order[b.status] ?? 99);
    if (statusDiff !== 0) return statusDiff;

    return new Date(b.startDate) - new Date(a.startDate);
  });
}

export function useUserDashboardData() {
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMyOnboardings();

        if (!isMounted) return;

        const safeOnboardings = Array.isArray(data)
          ? data
          : data?.onboardings || [];
        const normalized = safeOnboardings
          .map(normalizeOnboarding)
          .filter(Boolean);
        setOnboardings(sortOnboardings(normalized));
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Kunde inte hämta dina onboardings.");
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: onboardings.length,
      ongoing: onboardings.filter((o) => o.status === "Pågår").length,
      notStarted: onboardings.filter((o) => o.status === "Ej startad").length,
      done: onboardings.filter((o) => o.status === "Klar").length,
    };
  }, [onboardings]);

  return {
    onboardings,
    loading,
    error,
    stats,
  };
}
