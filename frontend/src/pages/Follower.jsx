import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Follower = () => {
  const [followers, setFollowers] = useState([]);
  // const [isloading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   // ton fetch ici si besoin
  // }, []);

  return (
    <div>
      <div className="relative   overflow-hidden">
        <img
          src="/images/logo.png"
          alt="Background logo"
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        <div className="fixed inset-0  backdrop-blur-md z-10 pointer-events-none">
          <div className="absolute inset-0  opacity-30 animate-gradient-x"></div>
        </div>
        <div className="">
          <Navbar />
        </div>
        <div className="relative z-10 flex flex-col items-center  px-4 text-white">
          <h1 className="text-4xl font-bold mb-6 py-32 text-center drop-shadow-lg">
            {followers.length} Followers
          </h1>
          <div className="space-y-2 text-lg">
            {followers.map((follower) => (
              <p key={follower.id} className="drop-shadow">
                {follower.username}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Follower;
