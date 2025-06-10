import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";

const App = () => {
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="container nx-auto p-2">
          <Link to="/">
            <h2 className="text-white text-2x1 font-bold">React Crud</h2>
          </Link>
        </div>
      </nav>
      <Routes>
        <Route index element={<HomePage />}></Route>
        <Route path="/create" element={<CreatePage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
