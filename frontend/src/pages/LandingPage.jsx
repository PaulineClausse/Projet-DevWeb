import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center px-6 py-10">
      {/* Logo */}
      <img
        src="../../public/images/logo.png"
        alt="Logo"
        className="w-48 h-48 object-contain mb-10"
      />

      {/* Conteneur boutons */}
      <div className="bg-zinc-800 rounded-2xl p-8 shadow-lg w-full max-w-sm flex flex-col items-center gap-6">
        <button
          onClick={() => navigate("/register")}
          className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-3 rounded-md shadow"
        >
          Créer un compte
        </button>

        <button
          onClick={() => navigate("/auth")}
          className="w-full border-2 border-cyan-400 text-white font-semibold py-3 rounded-md hover:bg-zinc-700 transition duration-200"
        >
          Se Connecter
        </button>
      </div>
    </div>
  );
};

export default LandingPage;