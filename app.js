require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const morgan = require('morgan')
// const csrfProtection = require('./middlewares/csrf');
const methodOverride = require('method-override');
const path = require('path');
const sequelize = require('./config/db.config');
const { formatStringToAgo } = require('./utilities/helpers');
const { userContext } = require('./middlewares/auth');

const app = express();


const sessionStore = new SequelizeStore({
     db: sequelize,
     checkExpirationInterval: 15 * 60 * 1000, // Check every 15 mins
     expiration: 24 * 60 * 60 * 1000, // Expire sessions after 24 hours
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'))
app.use(expressLayouts);
app.set('layout', 'layouts/layout')
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(morgan('dev'))
app.use(session({
     secret: 'gghvhyg7678yuhfgvtr56y7uijhgfrd4e3wer5t6789ijuy7t6r5e4e',
     resave: true,
     saveUninitialized: true,
     store: sessionStore,
     cookie: {
          maxAge: 100 * 60 * 60 * 24,
          // httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
     }
}));
app.use(userContext)
app.use(flash());
// Add csrf protection to all routes
// app.use(csrfProtection);

// Global variables for flash messages
app.use((req, res, next) => {
     // console.log("this is req",req)
     res.locals.success_msg = req.flash('success_msg');
     res.locals.info_msg = req.flash('info_msg');

     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
     // res.locals.csrfToken = req.csrfToken();
     // if (req.session.user) {

     res.locals.formatStringToAgo = formatStringToAgo
     // } else {
     //      console.log('from the global middlewares user =>', req.session.user)
     //      res.locals.user = null
     // }
     next();
});

// Routes setup
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Starting the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
