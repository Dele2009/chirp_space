const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth');
const { verifyIdToken } = require('../config/firebase-admin.config');
const getFollowersAndFollowing = require('../middlewares/getUserFollows');

// Google auth
router.get('/auth/google', (req, res)=>{
     const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=email%20profile`;
     res.redirect(googleAuthURL);
});
router.get('/auth/google/callback', authController.googleAuth);


router.post('/auth/facebook', async (req, res) => {
     const { idToken, userdetails } = req.body;

     try {
          const decodedToken = await verifyIdToken(idToken);
          console.log('decoded token =>>', decodedToken)
          console.log('user details =>>', userdetails)
          if (!decodedToken && decodedToken.email !== userdetails.email) {
               // req.session.user = decodedToken;
               return res.status(401).json({ message: 'Invalid token or email mismatch' });
          }
          res.status(200).json({ message: 'User authenticated successfully', user: decodedToken });

     } catch (error) {
          res.status(500).json({ message: 'Server error during authentication', error });
     }
});


// Registration page
router.get('/register', (req, res) => res.render('auth/register', { title: 'Sign Up | Chirp space', layout: 'layouts/no-layout' }));

// Handle registration
router.post('/register', authController.register);

// Login page
router.get('/login', (req, res) => res.render('auth/login', { title: 'Sign in | Chirp space', layout: 'layouts/no-layout' }));

// Handle login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

// Profile page (requires authentication)
router.get('/profile', isAuthenticated, getFollowersAndFollowing, userController.getProfile);

// Edit profile
router.post('/profile/edit', isAuthenticated, userController.editProfile);

// Delete account
router.post('/profile/delete', isAuthenticated, userController.deleteAccount);

// Search users
router.get('/search', isAuthenticated, userController.searchUsers);

// Follow/Unfollow users
router.post('/follow/:id', isAuthenticated, userController.followUser);

module.exports = router;
