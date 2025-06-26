import Navbar from "./components/Navbar";
import Authentication from "./pages/Authentication";
import Home from "./pages/HomePage";
import Profil from "./pages/ProfilPage";
import Followers from "./pages/Follower";
import Following from "./pages/Following";
import NewAccount from "./pages/NewAccount";
import Notifications from "./pages/NotificationPage";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AllUsersPage from "./pages/allUsers";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/authentication" element={<Authentication />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profil/:id" element={<Profil />} />
      <Route path="/followers/:id" element={<Followers />} />
      <Route path="/following/:id" element={<Following />} />
      <Route path="/register" element={<NewAccount />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/allUsers" element={<AllUsersPage />} />
    </Routes>
  );
};

export default App;
