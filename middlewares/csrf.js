const csrf = require('csurf');

// Setup CSRF protection
const csrfProtection = csrf({ cookie: true });

module.exports = csrfProtection;
