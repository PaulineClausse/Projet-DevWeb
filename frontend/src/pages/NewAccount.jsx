import { useState } from "react";
import axios from "axios";

const NewAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    first_name: "",
    biography: "",
    image: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      await axios.post("http://localhost:5000/register", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.href = "/auth";
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Erreur lors de l’enregistrement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 px-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md mt-8 border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Créer un compte
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Pseudo</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Xx-DarkChad64-xX"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Nom de famille
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Presto"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Prénom</label>
            <input
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Jean"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Biographie
            </label>
            <input
              name="biography"
              type="text"
              value={formData.biography}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Fan des Beatles et grand admirateur des oiseaux exotiques"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl font-semibold transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Création du compte..." : "Créer un compte"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          J'ai déjà un compte !{" "}
          <a
            href="/auth"
            className="text-blue-600 hover:underline font-semibold"
          >
            Se connecter
          </a>
        </p>
        {errorMsg && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center text-sm">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAccount;
