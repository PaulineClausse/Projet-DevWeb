const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
  followerId: {
    type: String, // Utilise String pour compatibilité avec les autres services (ex: user_id)
    required: true,
  },
  followingId: {
    type: String, // Utilise String pour compatibilité avec les autres services (ex: user_id)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Follower = mongoose.model("Follower", followerSchema);
module.exports = Follower;