// App.jsx
import { Component } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import {
  AiOutlineUser,
} from "react-icons/ai";

const Navbar = () => {
  return (
    <div className="relative bg-[rgb(38,38,38)]">

      {/* Top Right User Icon */}
      <div className="absolute top-4 right-4  text-white">
        <button className="p-2 rounded-full bg-[rgb(38,38,38)] shadow-md hover:text-blue-500 transition">
          <Link to="/auth">
            <AiOutlineUser className="text-2xl" />
          </Link>
        </button>
      </div>

      {/* Image Bottom Top Left */}
      <div className='Image_Top_Left'>
        <img src="../public/images/logo.png" className="w-20 h-20 fixed md:w-15 md:h-15 md:fixed md:top-4 md:left-20 md:z-50"/>
        <img src="../public/images/logo.png" className="w-20 h-20 left-3 fixed md:w-15 md:h-15 md:fixed md:top-4 md:left-20 md:z-50 opacity-30"/>
      </div>


      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-8 bg-[rgb(38,38,38)] p-4 rounded-2xl shadow-lg md:hidden">
        <button className="mt-1 ">
          <a><svg
            className="w-7 h-7 hover:fill-white"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 576 512"
            fill="rgb(38, 38, 38)"
          >
            <path
              d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
              stroke="rgb(191, 191, 199)"
              stroke-width="40"
            />
          </svg></a>
        </button>

        <button className="mt-1 ">
          <svg
            className="w-7 h-7 hover:fill-white"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 448 512"
            fill="rgb(191, 191, 198)"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
          </svg>
        </button>

        <button className="mt-1 hover:fill-white">
          <svg
            className="w-7 h-6 hover:fill-white"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 512 512"
            fill="rgb(38, 38, 38)"
          >
            <path
              d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
              stroke="rgb(191, 191, 199)"
              stroke-width="40"
            />
          </svg>
        </button>
      </div>


        {/* Desktop vertical menu */}
      <nav className="hidden md:flex flex-col fixed top-16 left-4 text-white bg-[rgb(38,38,38)] rounded-2xl shadow-md w-40 p-4 space-y-7">
        <a href="/pages" className="hover:text-blue-400 flex items-center space-x-2">
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 576 512"
            fill="rgb(38, 38, 38)"
          >
            <path
              d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
              stroke="rgb(191, 191, 199)"
              stroke-width="40"
            />
          </svg>
          <span>Home</span>
        </a>
        <a href="/pages" className="hover:text-blue-400 flex items-center space-x-2">
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 448 512"
            fill="rgb(191, 191, 198)"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
          </svg>
          <span>Alerts</span>
        </a>
        <a href="/pages" className="hover:text-blue-400 flex items-center space-x-2">
          <svg
            className="w-7 h-6"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 512 512"
            fill="rgb(38, 38, 38)"
          >
            <path
              d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
              stroke="rgb(191, 191, 199)"
              stroke-width="40"
            />
          </svg>
          <span>Messages</span>
        </a>
      </nav>
    </div>

    
  );
};

export default Navbar;
