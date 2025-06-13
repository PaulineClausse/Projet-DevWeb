// const { DataTypes } = require('sequelize');
// const sequelize = require('../../src/config/database');

// const User = sequelize.define('User', {
//   user_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: DataTypes.STRING,
//   first_name: DataTypes.STRING,
//   username: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
//   email: DataTypes.STRING,
//   phone: DataTypes.STRING,
//   biographie: DataTypes.STRING,
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: DataTypes.STRING,
//   profile_pic: DataTypes.STRING,
// }, {
//   timestamps: true, // createdAt et updatedAt automatiques
// });

// module.exports = User;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('authdb', 'authuser', 'authpassword', {
  host: 'mysql-db',
  dialect: 'mysql'
});

module.exports = sequelize;