import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        const result = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", result.token);
        setSuccess("Connexion réussie");
        navigate("/");
      } else {
        await registerUser(formData);
        setSuccess("Compte créé avec succès. Connectez-vous.");
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 pb-3 text-sm font-medium transition ${
              mode === "login"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Connexion
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 pb-3 text-sm font-medium transition ${
              mode === "register"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Inscription
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          {mode === "login" ? "Bienvenue sur TechStore" : "Créer un compte"}
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}
        {success && (
          <p className="mb-4 text-sm text-green-600 text-center">{success}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Nom"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            required
          />

          {mode === "register" && (
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmer le mot de passe"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {mode === "login" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
