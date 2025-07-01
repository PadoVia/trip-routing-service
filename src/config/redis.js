const { createClient } = require('redis');
const { REDIS_URL } = require('../env');

const redis = createClient({ url: REDIS_URL });

redis.on('error', (err) => {
  console.error('❌ Errore Redis:', err);
});

async function connectRedis() {
  if (redis.isOpen) {
    console.log('ℹ️ Redis già connesso, nessuna azione necessaria');
    return redis;
  }

  try {
    await redis.connect();
    console.log('✅ Connesso a Redis');
  } catch (err) {
    console.error('❌ Impossibile connettersi a Redis:', err);
    process.exit(1);
  }

  return redis;
}

module.exports = {
  redis,
  connectRedis,
};
