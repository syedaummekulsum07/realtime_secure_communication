// const redis = require('redis');
// const client = redis.createClient({ url: process.env.REDIS_URL });
// client.connect();
// module.exports = client;

require('dotenv').config();
const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('connect', () => console.log('Redis connected'));
client.on('ready', () => console.log('Redis ready'));
client.on('error', (err) => console.error('Redis error:', err));
client.on('end', () => console.log('Redis connection closed'));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Failed to connect Redis:', err);
    process.exit(1);
  }
})();

module.exports = client;
