const { createClient } = require('redis');
const { REDIS_URL, OPERATOR_SLUG } = require('../env');

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

async function savePossibleTrip(vehicleId, tripObject) {
  if (!redis.isOpen) {
    await connectRedis();
  }

  const key = `operator:${OPERATOR_SLUG}:vehicles:possible_trips:${vehicleId}`;
  try {
    const trip = JSON.stringify(tripObject);
    await redis.lPush(key, trip);
    await redis.publish(key, trip);
  } catch (err) {
    console.error(`❌ Errore durante il salvataggio del trip su ${key}:`, err);
  }
}

async function saveAllPossibleTrips(vehicleId, foundTrips) {
  if (!redis.isOpen) {
    await connectRedis();
  }

  const promises = foundTrips.map(trip => {
    return savePossibleTrip(vehicleId, trip);
  });

  try {
    await Promise.all(promises);
  } catch (err) {
    console.error(`❌ Errore durante il salvataggio dei trip per ${vehicleId}:`, err);
  }
}

module.exports = {
  redis,
  connectRedis,
  saveAllPossibleTrips
};
