import { useTheme } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center z-50 gap-2">
      <button
        onClick={toggleTheme}
        className="px-3 py-1 bg-gray-700 text-white rounded"
      >
        {theme === "dark" ? "🌞 Clair" : "🌙 Sombre"}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
