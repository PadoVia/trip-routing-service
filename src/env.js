require('dotenv').config();

function requireEnv(varName) {
  const value = process.env[varName];
  if (!value) {
    console.error(`❌ Variabile d'ambiente mancante: ${varName}`);
    process.exit(1);
  }
  return value;
}

// ✅ Export di tutte le variabili che servono
module.exports = {
  REDIS_URL: requireEnv('REDIS_URL'),
  REDIS_PORT: requireEnv('REDIS_URL').split('/').pop() || '0',
  PG_HOST: requireEnv('PG_HOST'),
  PG_PORT: requireEnv('PG_PORT'),
  PG_USER: requireEnv('PG_USER'),
  PG_PASSWORD: requireEnv('PG_PASSWORD'),
  PG_DATABASE: requireEnv('PG_DATABASE'),
  OPERATOR_SLUG: requireEnv('OPERATOR_SLUG'),
};
