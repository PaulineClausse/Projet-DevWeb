import Navbar from "./components/Navbar";
import Authentication from "./pages/Authentication";
import Home from "./pages/HomePage";
import { Route, Routes, Link } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;
