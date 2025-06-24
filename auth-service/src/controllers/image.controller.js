const sequelize = require("../config/database");
const { User } = require("../models");
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const userId = req.user.user_id;
    const image = req.file.filename;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ image });

    res
      .status(200)
      .json({ message: "Image uploaded", filename: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
