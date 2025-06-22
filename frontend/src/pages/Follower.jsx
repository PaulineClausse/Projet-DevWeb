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
          <div className="fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20">
            <img
              src="./images/pdp_test.jpg"
              alt="Profil 1"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <img
              src="./images/pdp_test.jpg"
              alt="Profil 2"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <img
              src="./images/pdp_test.jpg"
              alt="Profil 3"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
          </div>
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
