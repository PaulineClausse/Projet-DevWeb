const User = require('./user.model');
const Role = require('./role.model');
const UserRole = require('./user_roles.model');

// Relations
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });

module.exports = {
  User,
  Role,
  UserRole
};