import Navbar from '../components/Navbar';

const Authentication = () => {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-[rgb(38,38,38)] flex flex-col items-center justify-center px-4">
      

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mt-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Connexion
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: utilisateur@mail.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Mot de passe</label>
            <input
              type="password"
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
          Pas encore de compte ?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Authentication;
