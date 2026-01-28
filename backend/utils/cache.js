// Redis Cache Middleware - Phase 2.2
// Implements caching for API responses to reduce database load

const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error:', err));
client.connect().catch((err) => console.error('Redis connect error:', err));

// Cache middleware with configurable TTL (Time To Live)
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cachedData = await client.get(key);
      if (cachedData) {
        console.log(`✅ Cache HIT: ${key}`);
        return res.json(JSON.parse(cachedData));
      }
    } catch (err) {
      console.error('Cache get error:', err);
    }

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      try {
        client.setEx(key, duration, JSON.stringify(data))
          .catch(err => console.error('Cache set error:', err));
      } catch (err) {
        console.error('Cache serialize error:', err);
      }
      return originalJson(data);
    };

    next();
  };
};

// Clear cache by pattern
const clearCache = async (pattern = '*') => {
  try {
    const keys = await client.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
      await client.del(keys);
      console.log(`🧹 Cache cleared: ${keys.length} keys deleted`);
    }
  } catch (err) {
    console.error('Clear cache error:', err);
  }
};

// Clear specific cache key
const clearCacheKey = async (key) => {
  try {
    await client.del(`cache:${key}`);
    console.log(`🧹 Cache key deleted: ${key}`);
  } catch (err) {
    console.error('Clear cache key error:', err);
  }
};

module.exports = { cacheMiddleware, clearCache, clearCacheKey, client };
