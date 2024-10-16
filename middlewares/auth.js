exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Please log in to view this resource.');
    return res.redirect('/users/login');
  }
  next();
};

exports.userContext = (req, res, next) => {
  if (req.session && req.session.user) {
    // Attach user data to res.locals
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null; // No user logged in
  }
  next(); // Proceed to next middleware or route
};



// module.exports.