const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class users extends Model {}

users.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    biography: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // contient le chemin vers l'image
    },
  },
  {
    sequelize,
    modelName: "users",
    timestamps: false,
  }
);

module.exports = users;
