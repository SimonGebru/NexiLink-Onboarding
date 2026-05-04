import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";

import { getMe, loginUser } from "../services/authService";
import { setUser } from "../auth/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Superenkel “minivalidering” så vi slipper tomma anrop
    if (!email.trim() || !password.trim()) {
      setError("Fyll i både e-post och lösenord.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({ email, password });

      const token = data?.token || data?.accessToken || data?.jwt;

      if (!token) {
        throw new Error("Backend returnerade ingen token.");
      }

      localStorage.setItem("token", token);

      let user = data?.user || null;

      // Säkerställer att vi har roll för employee i localstorage
      const needsMeFetch =
        !user?.role || (user?.role === "employee" && !user?.employeeId);

      if (needsMeFetch) {
        try {
          const meRes = await getMe();
          user = meRes?.user ?? meRes;
        } catch {
          console.log("getMe failed");
        }
      }

      if (user) {
        setUser(user);
      }

      // Skicka vidare beroende på roll
      if (user?.role === "employee") {
        navigate("/my/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Inloggningen misslyckades.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Logga in</CardTitle>
          <CardDescription>
            Logga in för att hantera onboarding och program.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                E-post
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din.epost@foretag.se"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Lösenord
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loggar in..." : "Logga in"}
            </Button>

            <div className="text-sm text-slate-600">
              Inget konto?{" "}
              <Link
                to="/register"
                className="font-medium text-slate-900 hover:underline"
              >
                Skapa konto
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
