const { createClient } = require('redis');
const { REDIS_URL, OPERATOR_SLUG } = require('../env');
const { VehicleRegistry } = require('../vehicles/vehicle-registry');

const vehicleRegistry = new VehicleRegistry();

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
    console.log('🔌 Redis Subscriber connesso');

    const pattern = `operator:${OPERATOR_SLUG}:vehicles:status:*`;

    const queue = new (await import('p-queue')).default({ concurrency: 100 });

    await redisSubscriber.pSubscribe(pattern, async (message, channel) => {
      const vehicleId = channel.split(':').pop();

      queue.add(async () => {
        try {
          const value = JSON.parse(message);

          const vehicle = vehicleRegistry.getOrCreate(vehicleId, value);
          await vehicle.process();

        } catch (err) {
          console.error(`⚠️ [${vehicleId}] Errore:`, err);
        }
      });
    });

    console.log(`📡 In ascolto su canale: ${pattern}`);
  } catch (err) {
    console.error('❌ Errore nella sottoscrizione Redis:', err);
  }
};

module.exports = startListening;
