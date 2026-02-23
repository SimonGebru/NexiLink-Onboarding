import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../../services/api.js";
import { getUiStatus } from "../utils/getUiStatus";

export function useDashboardHomeData() {
  const [activeOnboardings, setActiveOnboardings] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [activityFeed, setActivityFeed] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [todos, setTodos] = useState([]);
  const [goals, setGoals] = useState({ weekPercent: 0, monthPercent: 0 });
  const [activity7d, setActivity7d] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadData() {
      try {
        setLoading(true);

        const [onboardingsData, programsData, feedData] = await Promise.all([
          apiRequest("/api/onboardings?status=active", { method: "GET" }),
          apiRequest("/api/programs", { method: "GET" }),
          apiRequest("/api/dashboard/feed", { method: "GET" }).catch(() => null), // fallback
        ]);

        if (!alive) return;

        const formatted = (Array.isArray(onboardingsData) ? onboardingsData : [])
          .map((row) => {
            const o = row?.onboarding;
            const progress = row?.progress;
            return {
              id: o?._id,
              name: o?.employee?.fullName || "",
              role: o?.employee?.jobTitle || "",
              status: getUiStatus(progress, o?.overallStatus),
            };
          })
          .filter((item) => item.name);

        setActiveOnboardings(formatted);
        setPrograms(Array.isArray(programsData) ? programsData : []);

        if (feedData) {
          setActivityFeed(Array.isArray(feedData.activityFeed) ? feedData.activityFeed : []);
          setUpcoming(Array.isArray(feedData.upcoming) ? feedData.upcoming : []);
          setTodos(Array.isArray(feedData.todos) ? feedData.todos : []);
          setGoals(feedData.goals || { weekPercent: 0, monthPercent: 0 });
          setActivity7d(Array.isArray(feedData.activity7d) ? feedData.activity7d : []);
        } else {
          setActivityFeed([]);
          setUpcoming([]);
          setTodos([]);
          setGoals({ weekPercent: 0, monthPercent: 0 });
          setActivity7d([]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadData();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const programsTotal = programs.length;
    const ongoingTotal = activeOnboardings.filter((a) => a.status === "Pågår").length;
    const doneTotal = activeOnboardings.filter((a) => a.status === "Klar").length;
    const needsActionTotal = activeOnboardings.filter((a) => a.status === "Ej startad").length;

    return { programsTotal, ongoingTotal, doneTotal, needsActionTotal };
  }, [programs, activeOnboardings]);

  return {
    loading,

    activeOnboardings,
    programs,

    activityFeed,
    upcoming,
    todos,
    goals,
    activity7d,

    stats,
  };
}