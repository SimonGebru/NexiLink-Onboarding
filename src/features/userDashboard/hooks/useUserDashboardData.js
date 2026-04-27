import { useEffect, useMemo, useState } from "react";
import { fetchMyOnboardings } from "../../../services/userDashboardService";

function sortOnboardings(items = []) {
  const order = {
    "Pågår": 0,
    "Ej startad": 1,
    "Klar": 2,
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

        const safeOnboardings = Array.isArray(data) ? data : data?.onboardings || [];
        setOnboardings(sortOnboardings(safeOnboardings));
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