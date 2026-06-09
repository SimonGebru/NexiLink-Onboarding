import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock3 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { apiRequest } from "../services/api";

export default function MyQuizzes() {
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await apiRequest("/api/me/onboardings", { method: "GET" });

        const data = res?.onboardings || res || [];
        const rawArray = Array.isArray(data) ? data : [];

        const flatOnboardings = rawArray.map((item) =>
          item.onboarding ? item.onboarding : item,
        );

        setOnboardings(flatOnboardings);
      } catch (e) {
        setError("Kunde inte hämta dina tester.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const onboardingsWithQuiz = onboardings.filter((o) => o.assignedQuiz);

  if (loading) {
    return <div className="p-6 text-slate-500">Laddar tester...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen />
          Mina quiz
        </h1>
        <p className="text-slate-500 mt-1">
          Här samlas alla dina quiz du har att göra.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {onboardingsWithQuiz.length === 0 && !error ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
            <BookOpen className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Inga quiz tillgängliga
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Finns inget quiz att göra just nu.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {onboardingsWithQuiz.map((item) => (
            <Card
              key={item.id || item._id}
              className="flex flex-col border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {item.programName || item.program?.name || "Okänt program"}
                </CardTitle>
                <CardDescription>Tillhör din onboarding</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0 flex flex-col gap-4">
                {/* Status */}
                <div className="flex items-center gap-2 text-sm">
                  {item.assignedQuiz?.status === "passed" ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Godkänd
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <Clock3 className="h-4 w-4" />
                      Väntar på att göras
                    </span>
                  )}
                </div>

                <Link
                  to={`/my/quiz/${item.id}/quiz`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  {item.assignedQuiz?.status === "passed"
                    ? "Gör om quizzet"
                    : "Starta quiz"}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
