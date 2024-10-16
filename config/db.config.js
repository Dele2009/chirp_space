const { Sequelize } = require('sequelize');

// Initialize Sequelize instance
// const sequelize = new Sequelize('chirp_space', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging: false,  // Disable logging SQL queries to the console
//   // define: {
//   //   charset: 'utf8',
//   //   collate: 'utf8_general_ci'
//   // }
// });

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}
// Initialize Sequelize instance
const sequelize = process.env.NODE_ENV=== 'production' ? new Sequelize(DB_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Disable SQL query logs (optional)
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For self-signed certificates on render.com
    },
  },
}) : new Sequelize('chirp_space', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,  // Disable logging SQL queries to the console
  // define: {
  //   charset: 'utf8',
  //   collate: 'utf8_general_ci'
  // }
});


// Test connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
