import Navbar from '../components/Navbar';

const Register = () => {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-[rgb(38,38,38)] flex flex-col items-center justify-center px-4">
      

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mt-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Créer un compte
        </h2>

        <form className="space-y-4">
          <div>
            <div>
                <label className="block text-gray-700 text-sm mb-1">Email</label>
                <input
                    type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: utilisateur@mail.com"
                />
            </div>
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
            Créer le compte
          </button>
        </form>

      </div>
    </div>
    </div>
  );
};

export default Register;
