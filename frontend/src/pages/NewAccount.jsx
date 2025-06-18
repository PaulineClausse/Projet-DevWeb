import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const NewAccount = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    first_name: '',
    biography: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/register', formData);
        window.location.href = '/auth';
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de l’enregistrement');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[rgb(38,38,38)] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mt-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Créer un compte
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Username</label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Xx-DarkChad64-xX"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: utilisateur@mail.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Mot de passe</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Nom de famille</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Presto"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Prénom</label>
              <input
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jean"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Biographie</label>
              <input
                name="biography"
                type="text"
                value={formData.biography}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Fan des Beatles et grand admirateur des oiseaux exotiques"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Image de profil</label>
              <input
                name="image"
                type="text"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Créer un compte
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            J'ai déjà un compte !{' '}
            <a href="/auth" className="text-blue-600 hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewAccount;
