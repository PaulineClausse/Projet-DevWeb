import { useState } from "react";
import axios from "axios";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      window.location.href = "/home";
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Échec de connexion. Vérifiez vos identifiants."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 px-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md mt-8 border border-blue-200">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-20 h-20 mb-2"
          />
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Connexion</h2>
          <p className="text-gray-500 text-sm">
            Connecte-toi pour accéder à ton espace
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="ex: utilisateur@mail.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="••••••••"
              required
            />
          </div>
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center text-sm">
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl font-semibold transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
};

export default Authentication;