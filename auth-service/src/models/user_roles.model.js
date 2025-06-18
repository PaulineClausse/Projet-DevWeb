const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('user_roles', {
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'user_id' }
  },
  role_id: {
    type: DataTypes.INTEGER,
    references: { model: 'roles', key: 'role_id' }
  }
}, {
  tableName: 'user_roles',
  timestamps: false
});

module.exports = UserRole;
