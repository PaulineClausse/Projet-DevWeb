const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
  followerId: {
    type: Number,
    required: true,
  },
  followingId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Follower = mongoose.model("Follower", followerSchema);
module.exports = Follower;
