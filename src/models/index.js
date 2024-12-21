const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { tableName: 'users' });

const SleepEntry = sequelize.define('SleepEntry', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quality: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { tableName: 'sleep_entries' });

User.hasMany(SleepEntry, { as: 'sleepEntries', foreignKey: 'userId' });
SleepEntry.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  SleepEntry
};