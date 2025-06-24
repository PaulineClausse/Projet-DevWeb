import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://zing.com/notification/", {
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />
      <div className="pt-32 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Notifications</h1>
        {loading ? (
          <div className="text-gray-300">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-400">Aucune notification.</div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className="bg-zinc-800 rounded-xl p-4 text-white shadow"
              >
                <span className="font-semibold">{notif.message}</span>
                <span className="block text-xs text-gray-400 mt-1">
                  {new Date(notif.date).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;