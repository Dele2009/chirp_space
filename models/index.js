// const {Sequelize} = require('sequelize');
const sequelize = require('../config/db.config');

// Load models
const User = require('./User');
const Post = require('./Post');
const UserFollower = require('./UserFollower');


// Define relationships
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

// User.belongsToMany(User, { as: 'Followers', through: UserFollower, foreignKey: 'followingId', otherKey: 'followerId', });
// User.belongsToMany(User, { as: 'Following', through: UserFollower, foreignKey: 'followerId', otherKey: 'followingId', });

UserFollower.belongsTo(User, { as: 'Follower', foreignKey: 'followerId' });
UserFollower.belongsTo(User, { as: 'Following', foreignKey: 'followingId' });


// Sync all models with the database
sequelize.sync(
  {
    alter: false,
    force: false
  }
)
  .then(() => console.log('Models synchronized'))
  .catch(err => console.log('Sync error:', err));

module.exports = { User, Post, UserFollower };
