const redis = require('redis')
const debug = require('./debug');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  db: process.env.REDIS_DB || null,
  password: process.env.REDIS_PASSWORD || undefined,
  prefix: process.env.REDIS_PREFIX || null,
})

redisClient.on('error', (err) => {
  debug.redis(`Error: ${err.message}`);
})

module.exports = redisClient