import Navbar from './components/Navbar';
import Authentication from './pages/Authentication';
import { Route, Routes, Link } from "react-router-dom";

const App = () => {
  return (
     
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
  );
};

export default App;
