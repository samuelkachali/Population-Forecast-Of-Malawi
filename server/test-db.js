const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'db.wswcjjgiefpahydlkofm.supabase.co',
  database: 'postgres',
  password: 'admin01',
  port: 5432,
  ssl: { rejectUnauthorized: false },
  family: 4
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connection successful:', res.rows);
  }
  pool.end();
}); 