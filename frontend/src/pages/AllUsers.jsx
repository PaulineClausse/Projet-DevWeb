import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:3306/api/users", { // !!!!!!!!!!!!!!A changer avec Alej

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.user);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des utilisateurs");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des utilisateurs</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.user_id}
            className="border p-3 rounded-md shadow-sm bg-gray-50"
          >
            <p><strong>Nom :</strong> {user.first_name} {user.name}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Username :</strong> {user.username}</p>
            <p><strong>Rôle :</strong> {user.Roles?.[0]?.role_name || "N/A"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsersPage;
