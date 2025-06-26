const User = require('./user.model');
const Role = require('./roles.model');
const UserRole = require('./user_roles.model');

// Relations Many-to-Many
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', otherKey: 'role_id' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', otherKey: 'user_id' });

module.exports = {
  User,
  Role,
  UserRole
};