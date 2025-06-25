import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://zing.com/auth/admin/users", {
        withCredentials: true,
      });
      setUsers(response.data.users);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des utilisateurs");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://zing.com/auth/delete/${userId}`, {
        withCredentials: true,
      });
      // Mise à jour de la liste après suppression
      setUsers((prevUsers) => prevUsers.filter((u) => u.user_id !== userId));
    } catch (err) {
      console.error("Erreur suppression :", err);
      setError("Échec de la suppression de l'utilisateur");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <Navbar />
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-8">
        {users.map((user) => (
          <li
            key={user.user_id}
            className="
              relative
              opacity-0 translate-y-4 animate-fadeInUp delay-10 transition
              duration-200 ease-in-out transform hover:scale-105
              hover:bg-[rgb(55,134,148)] 
              mt-4 border-[2px] border-[rgba(119,191,199,0.5)]
              bg-[rgba(38,38,38,0.5)] bg-opacity-80 rounded-lg p-6
              shadow-[2px_1px_8px_rgba(255,255,255,0.15)]
              max-w-md mx-auto text-white
            "
          >
            <p><strong>Nom :</strong> {user.first_name} {user.name}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Username :</strong> {user.username}</p>
            <p><strong>Rôle :</strong> {user.Roles?.[0]?.role_name || "N/A"}</p>

            <button
              onClick={() => deleteUser(user.user_id)}
              className="
                absolute top-4 right-4
                text-red-500 font-semibold
                bg-red-100 bg-opacity-10
                px-4 py-1 rounded
                hover:bg-opacity-20 transition
                cursor-pointer
              "
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default AllUsersPage;
