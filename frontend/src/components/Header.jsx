import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full py-3">
      {/* Logo tout à gauche */}
      <img
        src="./images/logo.png"
        alt="Logo"
        className="absolute left-0 top-3 w-[75px] sm:w-[85px] lg:w-[85px] rounded-lg"
      />

      {/* Photo de profil centrée */}
      <button
        onClick={() => navigate("/profil")}
        className="mx-auto block"
        style={{ width: "64px", height: "64px" }}
      >
        <img
          className="rounded-full w-full h-full object-cover border-2 border-white"
          src="./images/pdp_test.jpg"
          alt="Profile"
        />
      </button>
    </div>
  );
};

export default Header;
