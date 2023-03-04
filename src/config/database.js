const mysql = require('mysql2');
require('dotenv').config();
// create the connection to database
const connection = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
   waitForConnections: true,
   connectionLimit: 10,
   maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
   idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
   queueLimit: 0
});

module.exports = connection;