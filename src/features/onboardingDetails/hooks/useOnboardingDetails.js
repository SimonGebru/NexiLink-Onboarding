import { useEffect, useMemo, useState } from "react";
import { fetchOnboardingById } from "../../../services/onboardingService";
import { fetchOnboardingQuizAttempts } from "../../../services/quizAttemptService";

export function useOnboardingDetails(id) {
  const [onboarding, setOnboarding] = useState(null);

  const [progress, setProgress] = useState({
    total: 0,
    done: 0,
    percent: 0,
  });

  const [quizAttempts, setQuizAttempts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [onboardingRes, attemptsRes] = await Promise.all([
          fetchOnboardingById(id),
          fetchOnboardingQuizAttempts(id),
        ]);

        if (!alive) return;

        setOnboarding(onboardingRes?.onboarding || null);

        setProgress(
          onboardingRes?.progress || {
            total: 0,
            done: 0,
            percent: 0,
          }
        );

        setQuizAttempts(
          Array.isArray(attemptsRes)
            ? attemptsRes
            : attemptsRes?.attempts || []
        );
      } catch (e) {
        if (!alive) return;

        setError(
          e?.message || "Kunde inte hämta onboarding-information."
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (id) {
      load();
    }

    return () => {
      alive = false;
    };
  }, [id]);

  const tasksSorted = useMemo(() => {
    const tasks = onboarding?.tasks || [];

    return tasks
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [onboarding]);

  function handlePatched(res) {
    setOnboarding(res?.onboarding || null);

    setProgress(
      res?.progress || {
        total: 0,
        done: 0,
        percent: 0,
      }
    );
  }

  return {
    onboarding,
    progress,
    tasksSorted,
    quizAttempts,
    loading,
    error,
    handlePatched,
  };
}