import { useTheme } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, toggleTheme, setCustomTheme } = useTheme();

  return (
    <div className="flex items-center z-50 gap-2">
      <button
        onClick={toggleTheme}
        className="px-3 py-1 bg-gray-700 text-white rounded"
      >
        {theme === "dark" ? "🌞 Clair" : "🌙 Sombre"}
      </button>
      <select
        value={theme}
        onChange={(e) => setCustomTheme(e.target.value)}
        className="bg-gray-800 text-white px-2 py-1 rounded"
      >
        <option value="dark">Sombre</option>
        <option value="light">Clair</option>
        <option value="purple">Violet</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
