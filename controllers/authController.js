const { Op } = require('sequelize');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { getRandomString } = require('../utilities/helpers');
const { verifyIdToken } = require('../config/firebase-admin.config');
const { default: axios } = require('axios');

// Register Google auth
// exports.googleAuth = async (req, res) => {
//      const { idToken, userdetails } = req.body;
//      const {
//           uid,
//           email,
//           emailVerified,
//           displayName,
//           photoURL,
//      } = userdetails
//      try {
//           const decodedToken = await verifyIdToken(idToken);
//           // console.log('decoded token =>>', decodedToken)
//           console.log('user details =>>', userdetails)
//           if (!decodedToken && decodedToken.email !== userdetails.email) {
//                // req.session.user = decodedToken;
//                req.flash('error_msg', 'Error: please try again')
//                res.redirect(req.url);
//                // return res.status(401).json({ message: 'Invalid token or email mismatch' });
//           }
//           let user = await User.findOne({ where: { googleUid: uid } })
//           if (!user) {
//                console.log('User doesnt exist')
//                const [firstName, lastName] = displayName.split(' ')
//                console.log('no google user creating now......')
//                user = await User.create({
//                     firstName,
//                     lastName,
//                     username: `@${firstName}${lastName}${getRandomString(4)}`,
//                     email,
//                     googleUid: uid,
//                     profilePic: photoURL,
//                     isActive: emailVerified
//                })
//           }
//           const { password, ...newUser } = user.dataValues
//           req.session.user = newUser
//           console.log(user, newUser)
//           console.log(req.session.user)
//           req.flash('success_msg', 'Authentication succesfull')
//           res.status(200).json({ message: 'User authenticated successfully', user: decodedToken });
//           res.redirect('/users/profile');
//      } catch (error) {
//           console.log(error)
//           req.flash('error_msg', 'Server error during authentication')
//           // res.status(500).json({ message: 'Server error during authentication', error });
//           res.redirect(req.url);
//      }
// }
exports.googleAuth = async (req, res) => {
     const { code } = req.query;

     try {
          // Exchange code for access token
          const { data } = await axios.post('https://oauth2.googleapis.com/token', null, {
               params: {
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                    grant_type: 'authorization_code',
                    code,
               },
          });

          // Fetch user info using the access token
          const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
               headers: { Authorization: `Bearer ${data.access_token}` },
          });

          const { id, email, verified_email, name, picture } = userInfo.data;

          let user = await User.findOne({ where: { googleUid: id } });

          if (!user) {
               console.log('User doesn’t exist, creating now...');
               const [firstName, lastName] = name.split(' ');

               user = await User.create({
                    firstName,
                    lastName,
                    username: `@${firstName}${lastName}${getRandomString(4)}`,
                    email,
                    googleUid: id,
                    profilePic: picture,
                    isActive: verified_email,
               });
          }

          const { password, ...googleUser } = user.dataValues;
          req.session.user = googleUser;

          // Save the session and redirect after successful save
          req.session.save((err) => {
               if (err) {
                    console.error('Session save error:', err);
                    req.flash('error_msg', 'Something went wrong with session management.');
                    return res.redirect('/users/login');
               }

               console.log('Session saved:', req.session.user);
               req.flash('success_msg', 'Authentication successful');
               res.redirect('/users/profile');
          });
     } catch (error) {
          console.error('Error during Google Authentication:', error.message);
          req.flash('error_msg', 'Authentication failed, please try again.');
          res.redirect('/users/login');
     }
};

// Register User
exports.register = async (req, res) => {
     const { firstName, lastName, username, email, password: Password } = req.body;

     try {
          const existingUser = await User.findOne({ where: { email } });
          if (existingUser) {
               req.flash('error_msg', 'Email is already registered.');
               return res.redirect('/users/register');
               // return;
          }
          const existingUsername = await User.findOne({ where: { username: `@${username}` } });
          if (existingUsername) {
               req.flash('error_msg', 'Username is already in use registered.');
               return res.redirect('/users/register');
               // return;
          }

          const user = await User.create({
               firstName,
               lastName,
               username: `@${username}`,
               email,
               password: Password
          });
          const { password, ...newUser } = user.dataValues
          console.log("user objects =>", user)
          console.log("new user allow =>", newUser)
          req.session.user = newUser;
          req.session.save((err) => {
               if (err) {
                    console.error('Session save error:', err);
                    req.flash('error_msg', 'Something went wrong with session management.');
                    return res.redirect('/users/login');
               }

               console.log('Session saved:', req.session.user);
               req.flash('success_msg', 'Authentication successful');
               res.redirect('/users/profile');
          });
     } catch (error) {
          console.error(error);
          res.redirect('/users/register');
          // res.status(500).send('Server Error');
     }
};

// Login User
exports.login = async (req, res) => {
     const { name, password: Password } = req.body;
     try {
          const user = await User.findOne({
               where: {
                    [Op.or]: [{ email: name }, { username: `@${name}` }]
               }
          });
          // console.log(user.dataValues)
          if (!user) {
               req.flash('error_msg', 'Invalid credentials.');
               return res.redirect('/users/login');
               // return;
          }

          const isMatch = await bcrypt.compare(Password, user.password);
          if (!isMatch) {
               req.flash('error_msg', 'Invalid credentials.');
               return res.redirect('/users/login');
               // return;
          }
          const { password, ...currentUser } = user.dataValues;
          console.log(currentUser)
          req.session.user = currentUser;
          await req.session.save();
          console.log(user, currentUser)
          console.log(req.session.user)
          req.flash('success_msg', 'You are logged in.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          // res.status(500).send('Server Error');
          res.redirect('/users/login');
     }
};

// Logout User
exports.logout = async (req, res) => {

     req.flash('success_msg', 'Logged out successfully.');
     req.session.destroy((err) => {
          if (err) {
               console.error('Session destroy error:', err);
               req.flash('error_msg', 'Error logging out. Please try again.');
               return res.redirect('/users/profile');
          }

          // Clear the cookie on the client side
          res.clearCookie('connect.sid', { path: '/' });

          return res.redirect('/users/login');
     });

};
