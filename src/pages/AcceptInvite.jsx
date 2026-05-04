import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api.js";
import { setUser } from "../auth/auth.js";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Lösenorden stämmer inte överens. Försök igen!");
      return;
    }

    try {
      const response = await apiRequest("/api/auth/accept-invite", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });

      if (response) {
        setIsSuccess(true);
        setMessage("Du loggas nu in");

        localStorage.setItem("token", response.token)
        setUser(response.user)

        setTimeout(() => {
          navigate("/my/dashboard");
        }, 1000);
      }
    } catch (error) {
      setMessage(error?.message || "Kunde inte få kontakt med servern.");
    }
  };

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-red-500 text-xl font-semibold">
          Ogiltig länk: Inbjudningstoken saknas i URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Välkommen! Välj ett lösenord
        </h2>

        {message && (
          <div
            className={`p-3 mb-4 rounded ${
              isSuccess
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSuccess}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bekräfta lösenord
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSuccess}
            />
          </div>

          <button
            type="submit"
            disabled={isSuccess}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isSuccess ? "Skapar konto.." : "Aktivera konto"}
          </button>
        </form>
      </div>
    </div>
  );
}
