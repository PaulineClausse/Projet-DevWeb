const User = require("./user.model");
const Roles = require("./roles.model");
const UserRole = require("./user_roles.model");

// Relations
User.belongsToMany(Roles, { through: "user_roles", foreignKey: "user_id" });
Roles.belongsToMany(User, { through: "user_roles", foreignKey: "role_id" });

module.exports = {
  User,
  Roles,
  UserRole,
};
