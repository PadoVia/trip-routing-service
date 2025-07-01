require('dotenv').config();
const { connectRedis } = require('./config/redis');
const { connectPg } = require('./config/postgres.js');
const startRedisListener = require('./redis/listener');

async function bootstrap() {
  try {
    console.log('🚀 Avvio di trip-routing-service');

    // 1. Connessione a Redis
    await connectRedis();

    // 2. Connessione a PostgreSQL
    //await connectPg();

    // 3. Start Redis pattern listener
    await startRedisListener();

    console.log('✅ Servizio avviato con successo');
  } catch (err) {
    console.error('❌ Errore durante l’avvio:', err);
    process.exit(1);
  }
}

bootstrap();
