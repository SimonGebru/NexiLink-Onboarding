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

import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Fyll i namn, e-post och lösenord.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({ name, email, password });

      // Efter register: gå till login
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registreringen misslyckades.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Skapa konto</CardTitle>
          <CardDescription>
            Registrera dig för att kunna logga in.
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
              <label className="text-sm font-medium text-slate-700">Namn</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="För- och efternamn"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">E-post</label>
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
              <label className="text-sm font-medium text-slate-700">Lösenord</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 6–8 tecken"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Skapar konto..." : "Skapa konto"}
            </Button>

            <div className="text-sm text-slate-600">
              Har du redan konto?{" "}
              <Link to="/login" className="font-medium text-slate-900 hover:underline">
                Logga in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}