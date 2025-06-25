const Notification = require("../models/notification.model");

// Créer une notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    if (!userId || !type || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const notif = new Notification({ userId: String(userId), type, message });
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndDelete(req.params.id);
    if (!notif) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Récupérer les notifications d'un utilisateur
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    if (!userId) return res.status(401).json([]);
    const notifs = await Notification.find({ userId: String(userId) }).sort({
      date: -1,
    });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
