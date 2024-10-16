const { User, Post } = require('../models');
const { ejsRenderer } = require('../utilities/helpers');

// Get profile details9
exports.getProfile = async (req, res) => {
     try {
          const { user } = req.session
          console.log(user, req.originalUrl)
          // const user = await User.findOne({ where: { id: currentUser.id } });
          const posts = await Post.findAll({ where: { userId: user.id } });
          const { followers, following } = req
          // ejsRenderer.useLayout(
          //      res,
          //      'users/profile',
          //      'layouts/auth-user-layout',
          //      { posts, followers, following }
          // )
          res.render('users/profile', {
               title: `Profile | ${user.username}`,
               layout: 'layouts/auth-user-layout',
               posts,
               followers,
               following
          });
     } catch (error) {
          console.error(error);
          req.flash('error_msg', 'Error getting profile')
          res.redirect('/');
     }
};

// Edit user profile
exports.editProfile = async (req, res) => {
     const { username, email } = req.body;
     try {
          await User.update({ username, email }, { where: { id: req.session.user.id } });
          req.flash('success_msg', 'Profile updated successfully.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};

// Delete account
exports.deleteAccount = async (req, res) => {
     try {
          await User.destroy({ where: { id: req.session.user.id } });
          req.session.destroy(err => {
               if (err) return res.status(500).send('Server Error');
               req.flash('success_msg', 'Account deleted successfully.');
               res.redirect('/users/profile');
          });
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};

// Search for users
exports.searchUsers = async (req, res) => {
     const { query } = req.query;
     try {
          const users = await User.findAll({ where: { username: { [Op.like]: `%${query}%` } } });
          // res.render('users/search', { users });
          ejsRenderer.useLayout(
               res,
               'users/search',
               'layouts/user-layout',
               { users }
          )
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};

// Follow/Unfollow users (simplified version)
exports.followUser = async (req, res) => {
     // Implement follow functionality (can use associations or a separate 'Followers' model)
     req.flash('success_msg', 'User followed/unfollowed successfully.');
     res.redirect('/');
};
