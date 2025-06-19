import Navbar from "./components/Navbar";
import Authentication from "./pages/Authentication";
import Home from "./pages/HomePage";
import Profil from "./pages/ProfilPage";
import NewAccount from "./pages/NewAccount";
import LandingPage from "./pages/Accueil";
import { Route, Routes, Link } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/register" element={<NewAccount />} />
      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
