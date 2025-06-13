import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Authentication = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      console.log('Login successful:', response.data);
      alert("Connexion réussie !");
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert("Échec de connexion.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[rgb(38,38,38)] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mt-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Connexion
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: utilisateur@mail.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Se connecter
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Pas encore de compte ?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
