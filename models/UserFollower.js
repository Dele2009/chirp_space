const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./User');  // Import User model

const UserFollower = sequelize.define('UserFollower', {
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, { timestamps: false });

// Define associations

module.exports = UserFollower;
