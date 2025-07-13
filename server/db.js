const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: true, // <--- Use this instead of { rejectUnauthorized: false }
  family: 4
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 