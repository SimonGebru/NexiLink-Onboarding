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

        const [onboardingsData, programsData, feedData, todosData] =
          await Promise.all([
            apiRequest("/api/onboardings?status=active", { method: "GET" }),
            apiRequest("/api/programs", { method: "GET" }),
            apiRequest("/api/dashboard/feed", { method: "GET" }).catch(
              () => null,
            ), // fallback
            apiRequest("/api/todos", { method: "GET" }).catch(() => []),
          ]);

        setTodos(Array.isArray(todosData) ? todosData : []);

        if (!alive) return;

        const formatted = (
          Array.isArray(onboardingsData) ? onboardingsData : []
        )
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
          setActivityFeed(
            Array.isArray(feedData.activityFeed) ? feedData.activityFeed : [],
          );
          setUpcoming(
            Array.isArray(feedData.upcoming) ? feedData.upcoming : [],
          );
          setGoals(feedData.goals || { weekPercent: 0, monthPercent: 0 });
          setActivity7d(
            Array.isArray(feedData.activity7d) ? feedData.activity7d : [],
          );
        } else {
          setActivityFeed([]);
          setUpcoming([]);
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
    const ongoingTotal = activeOnboardings.filter(
      (a) => a.status === "Pågår",
    ).length;
    const doneTotal = activeOnboardings.filter(
      (a) => a.status === "Klar",
    ).length;
    const needsActionTotal = activeOnboardings.filter(
      (a) => a.status === "Ej startad",
    ).length;

    return { programsTotal, ongoingTotal, doneTotal, needsActionTotal };
  }, [programs, activeOnboardings]);

  // Funktioner för todos
  const addTodo = async (text) => {
    try {
      const newTodo = await apiRequest("/api/todos", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
    } catch (error) {
      console.error("Kunde inte lägga till todo", error);
    }
  };

  const toggleTodo = async (id) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    try {
      await apiRequest(`/api/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !todoToToggle.completed }),
      });
    } catch (error) {
      console.error("Kunde inte uppdatera todo", error);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, completed: todoToToggle.completed }
            : todo,
        ),
      );
    }
  };
  const deleteTodo = async (id) => {
    try {
      await apiRequest(`/api/todos/${id}`, { method: "DELETE" });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Kunde inte radera todo", error);
    }
  };

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

    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
