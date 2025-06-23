import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
const Follower = () => {
  const [followers, setFollowers] = useState([]);
  const { id } = useParams();

  const getfollowers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4003/followers/followers/${id}`
      );
      const rawFollowers = response.data;

      const detailedFollowers = await Promise.all(
        rawFollowers.map(async (f) => {
          const res = await axios.get(
            `http://localhost:5000/user/${f.followerId}`,
            {
              withCredentials: true,
            }
          );

          return res.data.user;
        })
      );

      setFollowers(detailedFollowers);
      console.log("Followers complets :", detailedFollowers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getfollowers();
  }, [id]);

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
        <div className="relative   z-10 flex flex-col items-center  px-4 text-white">
          <h1 className="text-4xl font-bold mb-6 py-32 text-center drop-shadow-lg">
            {followers.length} Followers
          </h1>
          <div className="space-y-2 bg-[rgba(38,38,38,0.95)] w-10/12 h-auto  p-4 rounded-md text-lg">
            {followers.map((follower, index) => (
              <div
                key={follower.user_id}
                className={`drop-shadow py-2 ${
                  index !== followers.length - 1 ? "border-b border-white" : ""
                }`}
              >
                <img
                  src={
                    follower?.image
                      ? `http://localhost:5000/uploads/${follower.image}`
                      : "/images/pdp_basique.jpeg"
                  }
                ></img>
                <span className="text-sm font-semibold">
                  {follower.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Follower;
