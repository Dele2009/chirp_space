const { User, UserFollower } = require('../models'); // Assuming you have User and Follower models

const getFollowersAndFollowing = async (req, res, next) => {
     try {
          // Use userId from req.params if provided, otherwise use req.session.userId
          const userId = req.params.userId || req.session.user.id;

          // If no userId is available, return an error response
          if (!userId) {
               req.flash('error_msg', 'No user specified try again, User ID is required.')
               return res.redirect('/users/profile')
          }

          // Fetch followers (users who follow the user)
          const followers = await UserFollower.findAll({
               where: { followingId: userId },
               include: [{ model: User, as: 'Follower', attributes: ['id', 'username', 'profilePic'] }]
          });

          // Fetch following (users the user follows)
          const following = await UserFollower.findAll({
               where: { followerId: userId },
               include: [{ model: User, as: 'Following', attributes: ['id', 'username', 'profilePic'] }]
          });
          console.log(followers, following)

          // Attach the followers and following to the request object
          req.followers = followers;
          req.following = following;

          // Proceed to the next middleware or controller
          next();
     } catch (error) {
          console.error('Error fetching followers/following:', error);
          req.flash('error_msg', 'Failed to retrieve followers and following.')
          return res.redirect('/')
          // return res.status(500).json({ error: 'Failed to retrieve followers and following.' });
     }
};

module.exports = getFollowersAndFollowing;
