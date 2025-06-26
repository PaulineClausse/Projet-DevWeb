// App.jsx
import { Component } from "react";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [switchervisible, setSwitcherVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://zing.com/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (e) {
      // ignore error
    }
    navigate("/authentication");
  };
  const getUsers = async () => {
    try {
      const response = await axios.get("https://zing.com/auth/auth", {
        withCredentials: true,
      });
      console.log("Utilisateur connecté :", response.data.user);
      console.log(response.data.user);

      setUser(response.data.user);
    } catch (error) {
      console.log("Pas connecté", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className=" relative  z-50">
      {/* Image Bottom Top Left */}
      <div className="Image_Top_Left">
        <img
          src="../images/logo.png"
          className="w-24 h-24 fixed md:w-15 md:h-15 md:fixed md:top-4 md:left-20 md:z-50"
        />

        {!location.pathname.includes("profil") && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => navigate("/profil/" + user.user_id)}
              className="w-20 h-20 mx-auto block"
            >
              <img
                className=" rounded-full w-full h-full  object-cover border-2 border-white"
                src={
                  user?.image
                    ? `https://zing.com/auth/uploads/${user.image}`
                    : "../public/images/pdp_basique.jpeg"
                }
                alt="Profil"
              />
            </button>
          </div>
        )}

        <button
          onClick={() => setSwitcherVisible(!switchervisible)}
          className="w-14 h-20 fixed absolute right-0 top-0 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="fill-white"
          >
            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
          </svg>
        </button>

        <button
          className="fixed top-4 right-4 text-red-500 font-bold md:hidden z-50"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      
      </div>

      {switchervisible && (
        <div className="  fixed absolute right-0 top-24">
          <ThemeSwitcher />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-8 bg-[rgba(38,38,38,0.5)] p-4 rounded-2xl shadow-lg md:hidden">
        <button onClick={() => navigate("/home")} className="mt-1 ">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="22.5"
              viewBox="0 0 576 512"
              className="fill-white w-7 h-7"
            >
              <path
                d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                stroke="rgb(255,255,255)"
                stroke-width="40"
              />
            </svg>
          </a>
        </button>

        <button onClick={() => navigate("/notifications")} className="mt-1 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="fill-white w-7 h-7"
          >
            <path
              d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
              stroke="rgb(255,255,255)"
              stroke-width="40"
            />
          </svg>
        </button>

        <button className="mt-1 hover:fill-white">
          <svg
            className="fill-white w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 512 512"
          >
            <path
              d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
              stroke="rgb(255,255,255)"
              stroke-width="40"
            />
          </svg>
        </button>
      </div>

      {/* Desktop vertical menu */}
      <nav className="hidden md:flex flex-col fixed top-60 left-3 xl:left-16 text-white bg-[rgba(38,38,38,0.5)] rounded-2xl shadow-2xl w-40 p-4 space-y-7">
        <a
          href="/home"
          className="hover:text-blue-400 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 576 512"
            className="fill-white w-7 h-7"
          >
            <path
              d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
              stroke="rgb(255,255,255)"
              stroke-width="40"
            />
          </svg>
          <Link to="/home">
            <span> Home</span>
          </Link>
        </a>

        <a
          href="/notifications"
          className="hover:text-blue-400 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="fill-white w-7 h-7"
          >
            <path
              d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
              stroke="rgb(255,255,255)"
              stroke-width="40"
            />
          </svg>
          <span>Alerts</span>
        </a>

        <a
          href="/pages"
          className="hover:text-blue-400 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 512 512"
            className="fill-white w-7 h-6"
          >
            <path
              d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
              stroke="rgb(255,255,255)"
              stroke-width="40"
            />
          </svg>
          <span>Messages</span>
        </a>

        {/* className="left-40 fixed mx-auto block md:absolute md:top-96 md:left-14 md:z-50" */}

        <a>
          <button
            onClick={() => navigate("/profil/" + user.user_id)}
            className="flex px-2 items-center gap-x-4 hover:text-blue-400"
          >
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
              src={
                user?.image
                  ? `https://zing.com/auth/uploads/${user.image}`
                  : "../public/images/pdp_basique.jpeg"
              }
              alt="Profil"
            />
            <span className="text-white hover:text-blue-400">Profil</span>
          </button>
        </a>
        <button className="mt-4 text-red-500 font-bold" onClick={handleLogout}>
          Déconnexion
        </button>
        {(user?.roles?.includes("admin") ||
          user?.roles?.includes("moderateur")) && (
          <button
            onClick={() => navigate("/allUsers")}
            className="mt-4 text-red-500 font-bold"
          >
            Centre d'administration
          </button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
