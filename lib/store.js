const Redis = require("ioredis");

class RedisStore {
    constructor() {
        this.redis = new Redis();
    }

    async get(key,maxAge) {
        let data = await this.redis.get(`SESSION:${key}`);
        return JSON.parse(data);
    }

    async set(key = this.getID(24),sess, maxAge = 60 * 60 * 24 * 30 * 1000) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${key}`, JSON.stringify(sess), 'EX', maxAge / 1000);
        } catch (e) {}
        return key;
    }

    async destroy(key) {
        return await this.redis.del(`SESSION:${key}`);
    }
}

module.exports = RedisStore;