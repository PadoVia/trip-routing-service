const { Pool } = require('pg');
const {
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
} = require('../env');

const pool = new Pool({
  host: PG_HOST,
  port: Number(PG_PORT),
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
});

pool.on('connect', () => {
  console.log('✅ Connesso a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Errore nel pool PostgreSQL:', err);
});

async function connectPg() {
  try {
    // Verifica connessione eseguendo una semplice query
    await pool.query('SELECT NOW()');
  } catch (err) {
    console.error('❌ Connessione PostgreSQL fallita:', err);
    process.exit(1);
  }
}

module.exports = {
  pg: pool,
  connectPg,
};
