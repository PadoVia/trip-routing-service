const { createClient } = require('redis');
const { REDIS_URL, REDIS_PORT, OPERATOR_SLUG } = require('../env');
const { redis: redisReader, connectRedis } = require('../config/redis');

// Client separato solo per ascolto eventi
const redisSubscriber = createClient({ url: REDIS_URL });

redisSubscriber.on('error', (err) => {
  console.error('❌ Errore Redis Subscriber:', err);
});
redisSubscriber.on('ready', () => {
  console.log('📡 Redis Subscriber pronto!');
});

const startListening = async () => {
  try {
    await redisSubscriber.connect();
    await connectRedis();

    console.log('🔌 Connessi a Redis (subscriber + reader)');

    await redisSubscriber.sendCommand(['CONFIG', 'SET', 'notify-keyspace-events', 'KEA']);

    const pattern = `__keyspace@${REDIS_PORT}__:operator:${OPERATOR_SLUG}:vehicles:status:*`;

    const queue = new (await import('p-queue')).default({ concurrency: 100 });

    await redisSubscriber.pSubscribe(pattern, async (event, channel) => {
      const key = channel.replace(`__keyspace@${REDIS_PORT}__:`, '');
      const vehicleId = key.split(':').pop();

      queue.add(async () => {
        try {
          const value = JSON.parse(await redisReader.get(key));
          console.log(`📦 [${vehicleId}] Valore attuale della chiave '${key}':`, value);

          // processBus(vehicleId, value);

        } catch (err) {
          console.error(`⚠️ [${vehicleId}] Errore:`, err);
        }
      });
    });

    console.log(`📡 In ascolto su pattern: ${pattern}`);
  } catch (err) {
    console.error('❌ Errore nella sottoscrizione Redis:', err);
  }
};

module.exports = startListening;
