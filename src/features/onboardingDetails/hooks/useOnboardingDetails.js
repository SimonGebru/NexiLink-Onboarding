import { useEffect, useMemo, useState } from "react";
import { fetchOnboardingById } from "../../../services/onboardingService";

export function useOnboardingDetails(id) {
  const [onboarding, setOnboarding] = useState(null);
  const [progress, setProgress] = useState({ total: 0, done: 0, percent: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetchOnboardingById(id);
        if (!alive) return;

        setOnboarding(res?.onboarding || null);
        setProgress(res?.progress || { total: 0, done: 0, percent: 0 });
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Kunde inte hämta onboardingen.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (id) load();

    return () => {
      alive = false;
    };
  }, [id]);

  const tasksSorted = useMemo(() => {
    const tasks = onboarding?.tasks || [];
    return tasks.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [onboarding]);

  function handlePatched(res) {
    setOnboarding(res?.onboarding || null);
    setProgress(res?.progress || { total: 0, done: 0, percent: 0 });
  }

  return {
    onboarding,
    progress,
    tasksSorted,
    loading,
    error,
    handlePatched,
  };
}