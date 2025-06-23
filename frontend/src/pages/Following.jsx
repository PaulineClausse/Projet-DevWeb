import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";

const Following = () => {
  const [following, setFollowing] = useState([]);
  const { id } = useParams();

  const getFollowing = async () => {
    try {
      const response = await axios.get(
        `https://zing.com/followers/followers/following/${id}`
      );
      const rawFollowing = response.data;

      const detailedFollowing = await Promise.all(
        rawFollowing.map(async (f) => {
          const res = await axios.get(
            `https://zing.com/auth/user/${f.followingId}`,
            {
              withCredentials: true,
            }
          );
          return res.data.user;
        })
      );

      setFollowing(detailedFollowing);
    } catch (error) {
      console.error("Erreur lors du chargement des followers :", error);
    }
  };

  useEffect(() => {
    getFollowing();
  }, [id]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background blur + image */}
      <img
        src="/images/logo.png"
        alt="Background logo"
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-20"
      />
      <div className="fixed inset-0 backdrop-blur-md z-0" />

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 drop-shadow-lg text-center">
          {following.length} Following
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {following.map((follow) => (
            <div
              key={follow.user_id}
              className="bg-zinc-800/80 rounded-xl p-4 flex items-center  gap-4 transition-transform hover:scale-105 shadow-lg backdrop-blur-sm"
              onClick={() =>
                (window.location.href = `/profil/${follow.user_id}`)
              }
            >
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={
                  follow?.image
                    ? `https://zing.com/auth/uploads/${follow.image}`
                    : "/images/pdp_basique.jpeg"
                }
                alt={`${follow.username} profile`}
              />
              <div>
                <p className="text-lg font-semibold">{follow.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Following;
